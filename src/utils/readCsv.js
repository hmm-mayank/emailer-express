import csv from "csv-parser";
import fs from "fs";
import { Email } from "../models/emailStructure.js";
import Axios from "axios";
import async from "async";
import { Op } from "sequelize";
import { QueueStatus } from "../models/queueStatus.js";
import path from "path";
const mailformat =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  
  const uploadFilePath = `${process.cwd()}/uploads`;

export const readCsv = (filePath) => {


    // setTimeout(() => {
    //     console.log("EXECUTION STARTED")
    //   validateEmails();
    // }, 15000);
    console.log("Current directory:", `${process.cwd()}/uploads`);
  fs.createReadStream(
    filePath ??
      "/Users/mayankdwivedi/Desktop/himanshu/emailer/emailer-express/data/email.csv"
  )
    .pipe(csv())
    .on("data", async (row) => {
      let valusesInObj = Object.values(row);
      valusesInObj.map(async (valusesInObj) => {
        let properEmail = valusesInObj.trim();
        if (mailformat.test(properEmail)) {
          try {
            // const emailResponse = await RESTValidateEmails(properEmail);
            // console.log(emailResponse.success);
            const createEntry = await Email.create({
              email: properEmail,
              byUser: 10,
            });
          } catch (error) {
            console.log("Mayank", error);
          }
        }
      });
    })
    .on("end", (e) => {
        console.log(`File Execution Started`)
        validateEmailQueue();
      //   console.log(e);
    });
};

export const validateEmails = async () => {
  const readEmails = await Email.findAll();
  //   console.log(readEmails);
  return readEmails;
};

export const RESTValidateEmails = async (email) => {
  try {
    let endpoint = `http://65.109.184.105:9292/?email=${email}`;
    let response = await Axios({
      method: "POST",
      headers: {
        Authorization: process.env.EMAIL_AUTH,
      },
      url: endpoint,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const validateEmailQueue = async () => {
  const tasks = await Email.findAll({
    where: {
      rawInfo: {
        [Op.is]: null, // Like: status IS NULL
      },
    },
  });
  console.log(tasks.length);

  // Initializing the queue

  // Creating an array for all elements execution
  // const tasks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Initializing the queue
  const queue = async.queue((task, executed) => {
    console.log("Currently Busy Processing Task " + JSON.stringify(task));

    if (task.isValid === null || task.rawInfo === null) {
      try {
        RESTValidateEmails(task.email).then((apiResponse) => {
          console.log("Emails: " + JSON.stringify(apiResponse));
          Email.update(
            { isValid: apiResponse?.success || false, rawInfo: apiResponse },
            {
              where: { id: task.id },
            }
          ).then((updatedRecord) => {
            console.log(updatedRecord);
          });
        });
      } catch (error) {
        console.log(error);
      }
    }

    setTimeout(() => {
      // Number of tasks remaining and to be processed
      const tasksRemaining = queue.length();
      executed(null, { task, tasksRemaining });
    }, 2000);
  }, 1); // concurrency value = 1

  // Queue is idle initially as no elements are there...
  console.log(`Queue Started ? ${queue.started}`);
  if(queue.started) {
    QueueStatus.update(
        { isRunning: true },
        {
          where: { id: 0 },
        }
      );
  }
  
  // Adding each task from the tasks list
  tasks.forEach((task) => {
    console.log(task.email);
    // Adding the task 5 to the head for priority execution
    if (task == 5) {
      queue.unshift(task, (error, { task, tasksRemaining }) => {
        if (error) {
          console.log(`An error occurred while processing task ${task}`);
        } else {
          console.log(
            `Finished processing task ${task}. ${tasksRemaining} tasks remaining`
          );
        }
      });
      // Adding all the tasks at tail to be executed except task 5
    } else {
      queue.push(task, (error, { task, tasksRemaining }) => {
        if (error) {
          console.log(`An error occurred while processing task ${task}`);
        } else {
          console.log(`Finished processing task ${task}. ${tasksRemaining}
            tasks remaining`);
        }
      });
    }
  });

  // Executes the callback when the queue is done processing all the tasks
  queue.drain(async () => {
    console.log("All items are succesfully processed !");
    const remainingEmails = await Email.findAll({
      where: {
        rawInfo: {
          [Op.is]: null, // Like: status IS NULL
        },
      },
    });
    if (remainingEmails.length > 0) {
      validateEmailQueue();
    } else {
      QueueStatus.update(
        { isRunning: false },
        {
          where: { id: 0 },
        }
      );
    }
  });

  // Checking if the queue is started after adding tasks
  console.log(`Queue Started ? ${queue.started}`);
};
