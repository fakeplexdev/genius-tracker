const fs = require('fs')
const express = require('express')
const axios = require('axios')
const app = express()

app.use(express.json())
app.use(express.static('public'))

let transcriptions = 0, forumpost = 0, annotations = 0, answers = 0, questions = 0, iq = 0

function sendRequest(name, id) {
   axios({
      "method":"GET",
      "url":`https://api.genius.com/users/${id}`,
      "headers":{
         "content-type":"application/json",
         "useQueryString":true
      },
      "params":{
         "access_token":"ACCESS_TOKEN_HERE" //Get this at api.genius.com
      }
      })
      .then((response) => {

         const json = response.data.response.user
         
         transcriptions += json.stats.transcriptions_count
         annotations += json.stats.annotations_count
         answers += json.stats.answers_count
         questions += json.stats.questions_count
         forumpost += json.stats.forum_posts_count
         iq += json.iq
      })
      .catch((error) => {
        console.log(error)
   })
}

app.listen(3000, async () => {
   const json = JSON.parse(fs.readFileSync('./public/users.json'))

   for (user in json.users) {
      await sendRequest(user, json.users[user])
   }

   setTimeout(() => {
      console.log('-----------------------')
      console.log(`Transcripties 📝: ${transcriptions}`)
      console.log(`Annotaties ✍️: ${annotations}`)
      console.log(`Forum Posts 📥: ${forumpost}`)
      console.log(`Vragen gesteld ❓: ${questions}`)
      console.log(`Vragen geantwoord 🙋‍♂️: ${answers}`)
      console.log(`IQ van de community 💡: ${iq}`)
   }, 3000)
})