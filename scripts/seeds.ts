const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

const main = async () => {
    try {
        await database.category.createMany({
            data: [
                { name: "Software development" },
                { name: "Web Development" },
                { name: "Mobile App Development" },
                { name: "Data Science" },
                { name: "Machine Learning" },
                { name: "Artificial Intelligence" },
                { name: "Ui/Ux Design" },
                { name: "Product Management" },
                { name: "Project Management" },
                { name: "Quality Assurance" },
                { name: "DevOps" },
                { name: "Cybersecurity" },
                { name: "Cloud Computing" },
                { name: "Database Administrator" },
                { name: "NetWork Engineering" },
                { name: "Business Analysis" },
                { name: "Sales" },
                { name: "Marketing" },
                { name: "Customer Support" },
                { name: "Human Resource" },
                { name: "Finance" },
                { name: "Legal" },
            ],
        });
        console.log("Success");
    } catch (error) {
        console.log(`Error on seeding the database categories : ${error}`);
    }
};

main();
