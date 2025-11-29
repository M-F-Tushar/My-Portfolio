import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // 1. Profile
    const profile = await prisma.profile.create({
        data: {
            name: "Your Name",
            title: "AI/ML Engineer",
            bio: "Building intelligent systems with LLMs, Deep Learning, and Production ML. Specializing in NLP, Computer Vision, and deploying AI at scale.",
            summary: "I'm an AI/ML engineer with [X] years of experience building production-ready machine learning systems. I specialize in Large Language Models, Deep Learning, and deploying AI solutions that solve real-world problems at scale.\n\nCurrently, I'm focused on LLM fine-tuning, RAG systems, and building AI agents. I'm passionate about making AI accessible and practical for businesses.\n\nWhen I'm not training models, you can find me [your hobbies/interests].",
            email: "your.email@example.com",
            location: "Your City, Country",
            resumeUrl: "/resume.pdf",
            avatarUrl: "", // Placeholder
            aboutImage: "", // Placeholder
            yearsOfExperience: "3+",
            modelsDeployed: "15+",
        }
    })

    // 2. Social Links
    await prisma.socialLink.createMany({
        data: [
            { platform: "GitHub", url: "https://github.com/yourusername", icon: "Github" },
            { platform: "LinkedIn", url: "https://linkedin.com/in/yourusername", icon: "Linkedin" },
            { platform: "Email", url: "mailto:your.email@example.com", icon: "Mail" },
        ]
    })

    // 3. Skills
    const skills = [
        { category: "Machine Learning", names: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'Keras'] },
        { category: "LLMs & NLP", names: ['OpenAI', 'Hugging Face', 'LangChain', 'RAG', 'Fine-tuning', 'Transformers'] },
        { category: "Data & MLOps", names: ['Pandas', 'NumPy', 'MLflow', 'Weights & Biases', 'DVC'] },
        { category: "Deployment", names: ['Docker', 'FastAPI', 'AWS', 'GCP', 'CUDA', 'ONNX'] },
    ]

    for (const category of skills) {
        for (const name of category.names) {
            await prisma.skill.create({
                data: { name, category: category.category }
            })
        }
    }

    // 4. Experience
    await prisma.experience.create({
        data: {
            company: "Company Name",
            role: "Senior ML Engineer",
            period: "2022 - Present",
            description: "",
            achievements: JSON.stringify([
                "Built production LLM system serving 100K+ daily requests with 99.9% uptime",
                "Fine-tuned GPT models reducing inference costs by 60% while improving accuracy",
                "Designed RAG pipeline achieving 40% better retrieval accuracy than baseline"
            ]),
            techStack: JSON.stringify(['PyTorch', 'LangChain', 'AWS'])
        }
    })

    await prisma.experience.create({
        data: {
            company: "Previous Company",
            role: "ML Engineer",
            period: "2020 - 2022",
            description: "",
            achievements: JSON.stringify([
                "Developed computer vision models achieving 95% accuracy on production data",
                "Built data pipelines processing 10M+ records daily for model training",
                "Deployed ML models to production using Docker and Kubernetes"
            ]),
            techStack: JSON.stringify(['TensorFlow', 'Python', 'Docker'])
        }
    })

    // 5. Projects
    await prisma.project.create({
        data: {
            title: "LLM-Powered Chatbot",
            description: "Production chatbot using GPT-4 with RAG for domain-specific knowledge. Handles 10K+ conversations/day.",
            techStack: JSON.stringify(['OpenAI', 'LangChain', 'FAISS']),
            demoUrl: "#",
            repoUrl: "#",
            featured: true
        }
    })

    await prisma.project.create({
        data: {
            title: "Computer Vision Pipeline",
            description: "Real-time object detection system using YOLOv8. Deployed on edge devices with 30 FPS performance.",
            techStack: JSON.stringify(['PyTorch', 'YOLO', 'OpenCV']),
            demoUrl: "#",
            repoUrl: "#",
            featured: true
        }
    })

    await prisma.project.create({
        data: {
            title: "ML Model Monitoring Dashboard",
            description: "Real-time monitoring for ML models in production. Tracks drift, performance, and data quality.",
            techStack: JSON.stringify(['MLflow', 'FastAPI', 'React']),
            demoUrl: "#",
            repoUrl: "#",
            featured: true
        }
    })

    // 6. Education
    await prisma.education.create({
        data: {
            degree: "Bachelor/Master of Science in Computer Science / AI",
            school: "University Name",
            period: "2016 - 2020",
            details: "Relevant coursework: Machine Learning, Deep Learning, NLP, Computer Vision, Statistics"
        }
    })

    // 7. Certifications
    await prisma.certification.createMany({
        data: [
            { name: "TensorFlow Developer Certificate" },
            { name: "AWS Certified Machine Learning - Specialty" },
            { name: "Deep Learning Specialization (Coursera)" },
        ]
    })

    // 8. Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        }
    })

    console.log('Seed data inserted successfully')
    console.log('Default admin user created:')
    console.log('  Username: admin')
    console.log('  Password: admin123')
    console.log('  Please change the password after first login!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
