// let members = JSON.parse(await fs.readFile("./members.json", "UTF-8"));

// app.post("/events/members", middleware, async (req, res) => {
//     if (!req.body) {
//       return res.status(400).send({
//         message: "Content can not be empty!",
//         status: 400,
//       });
//     }
  
//     res.status(200).send({
//       message: "Success",
//       status: 200,
//     });
  
//     eventsMembers(req.body);
//   });


//   function eventsMembers(data) {
//     if (!data || !data.discord || !data.ingame || !data.role) {
//       return console.log({ message: "Empty body" });
//     }
//     const inArray = members.findIndex((object) => {
//       return object.discord === data.discord;
//     });
  
//     if (data.status === "true") {
//       members.splice(inArray, 1);
  
//       fs.writeFile("members.json", JSON.stringify(members), (err) => {
//         console.log(err);
//       });
//       return;
//     }
  
//     if (inArray !== -1) {
//       members[inArray] = {
//         discord: data.discord,
//         role: data.role,
//         ingame: data.ingame,
//       };
//     } else {
//       members.push({
//         discord: data.discord,
//         role: data.role,
//         ingame: data.ingame,
//       });
//     }
  
//     fs.writeFile("members.json", JSON.stringify(members), (err) => {
//       console.log(err);
//     });
//   }