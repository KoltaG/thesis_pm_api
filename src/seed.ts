import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User";
import Project from "./models/Project";
import Task from "./models/Task";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Function to generate dates between May 2024 and now
const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const startDate = new Date("2024-05-01");

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create PMs (2)
    const pmUsers = [
      {
        name: "John PM1",
        email: "john_pm1@example.com",
        password: hashedPassword,
        role: "PM",
        createdAt: generateRandomDate(startDate, new Date()),
        updatedAt: generateRandomDate(startDate, new Date()),
      },
      {
        name: "John PM2",
        email: "john_pm2@example.com",
        password: hashedPassword,
        role: "PM",
        createdAt: generateRandomDate(startDate, new Date()),
        updatedAt: generateRandomDate(startDate, new Date()),
      },
    ];

    // Create Devs
    const devUsers = Array.from({ length: 6 }, (_, i) => ({
      name: `John Dev${i + 1}`,
      email: `john_dev${i + 1}@example.com`,
      password: hashedPassword,
      role: "Dev",
      createdAt: generateRandomDate(startDate, new Date()),
      updatedAt: generateRandomDate(startDate, new Date()),
    }));

    // Combine PMs and Devs into one user array
    const createdUsers = await User.insertMany([...pmUsers, ...devUsers]);

    // Create Projects (5-10 projects)
    const projects = Array.from({ length: 7 }, (_, i) => ({
      name: `Project ${faker.company.name()}`,
      assignedUserIds: createdUsers.map((user) => user._id),
      tasks: [],
      createdAt: generateRandomDate(startDate, new Date()),
      updatedAt: generateRandomDate(startDate, new Date()),
    }));

    const createdProjects = await Project.insertMany(projects);

    // Create Tasks (5-15 tasks per project)
    const tasks = [];
    for (const project of createdProjects) {
      const taskCount = Math.floor(Math.random() * 11) + 5; // 5-15 tasks
      for (let i = 0; i < taskCount; i++) {
        const assignedUser =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        tasks.push({
          name: faker.hacker.phrase(),
          description: faker.lorem.paragraph({ min: 1, max: 3 }),
          projectId: project._id,
          assignedUserId: assignedUser._id,
          status: faker.helpers.arrayElement(["To Do", "In Progress", "Done"]),
          createdAt: generateRandomDate(startDate, new Date()),
          updatedAt: generateRandomDate(startDate, new Date()),
        });
      }
    }

    const createdTasks = await Task.insertMany(tasks);

    // Update Projects with Task IDs
    for (const project of createdProjects) {
      const projectTasks = createdTasks
        .filter((task) => task.projectId.toString() === project._id.toString())
        .map((task) => task._id);

      await Project.findByIdAndUpdate(project._id, {
        tasks: projectTasks,
      });
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedData();
