/* // seed.js
import mongoose from"mongoose"
import dotenv from "dotenv"
import { faker }from"@faker-js/faker"
import Author from"./models/Author"
import BlogPost from"./models/BlogPost"

dotenv.config()

const MONGO_URL = process.env.MONGO_URL

async function seedDatabase() {
  await mongoose.connect(MONGO_URL)
  console.log("🔌 Connesso a MongoDB")

  await Author.deleteMany()
  await BlogPost.deleteMany()

  // Crea autori fittizi
  const authors = []
  for (let i = 0; i < 50; i++) {
    const author = new Author({
      nome: faker.person.firstName(),
      cognome: faker.person.lastName(),
      email: faker.internet.email(),
      dataDiNascita: faker.date.birthdate({ mode: "age", min: 20, max: 60 }).toISOString().split("T")[0],
      avatar: faker.image.avatar(),
    })
    await author.save()
    authors.push(author)
  }

  // Crea blog post fittizi
  for (let i = 0; i < 50; i++) {
    const author = faker.helpers.arrayElement(authors)
    const post = new BlogPost({
      category: faker.word.adjective(),
      title: faker.lorem.sentence(5),
      cover: faker.image.urlLoremFlickr({ category: "blog" }),
      readTime: {
        value: faker.number.int({ min: 1, max: 10 }),
        unit: "min",
      },
      author: author.email,
      content: faker.lorem.paragraphs(3, "<br/>\n"),
    })
    await post.save()
  }

  console.log("✅ Database popolato!")
  process.exit()
}

seedDatabase()
 */