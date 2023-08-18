import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import logger from "./logger.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose
  .connect("mongodb+srv://abhirupchakraborty1998:cms1998@cluster0.mz9utqu.mongodb.net/CMS-db?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  usertype: String,
  firstname: String,
  lastname: String,
  city: String,
  address: String,
  phoneno: Number,
  college: String,
  stream: String,
  dateofbirth: Number,
  skill: String,
});

const userSchema2 = new mongoose.Schema({
  cname: String,
  email: String,
  address: String,
  status:String,
});

const User3 = new mongoose.model("user3", userSchema2);

const User = new mongoose.model("user", userSchema);

app.put("/profile", async (req, res) => {
  const {
    firstname,
    lastname,
    city,
    address,
    email,
    phoneno,
    college,
    stream,
    dateofbirth,
    skill,
  } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.send({ message: "This Email hasn't been registered yet!" });
    } else {
      user.firstname = firstname;
      user.lastname = lastname;
      user.city = city;
      user.address = address;
      user.phoneno = phoneno;
      user.college = college;
      user.stream = stream;
      user.dateofbirth = dateofbirth;
      user.skill = skill;

      // Save updated user document
      await user.save();

      res.send({ message: "Profile successfully updated!" });
    }
  } catch (err) {
    res.send(err);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfully", user: user });
        logger.info("login successfully");
      } else {
        res.send({ message: "Password didn't Match" });
      }
    } else {
      logger.info("user not exist");
      res.send({ message: "User Not Exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/login/get-details/:email", async (req, res) => {
  const em = req.params.email;
  const user = await User.findOne({ email: em });

  if (!user) {
    res.send({ message: "Not exist" });
  }
  res.status(200).json(user);
});

app.post("/register", async (req, res) => {
  const { name, email, password, usertype } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.send({ message: "User already registered" });
      logger.info("User already registered");
    } else {
      const newUser = new User({
        name,
        email,
        password,
        usertype,
      });
      await newUser.save();
      res.send({ message: "Successfully Registered, Please login now." });
      logger.info("Successfully Registered, Please login now.");
    }
  } catch (err) {
    res.send(err);
  }
});

app.post("/company", async (req, res) => {
  const { cname, email, address, status } = req.body;
  console.log(req.body);
  try {
    const user3 = await User3.findOne({ companyname: cname });
    if (user3) {
      res.send({ message: "This company is already in Everyone's feed" });
      logger.info("This company is already in Everyone's feed");

    } else {
      const newUser2 = new User3({
        cname,
        email,
        address,
        status
      });
      await newUser2.save();
      res.send({ message: "Successfully Registered" });
      logger.info("Successfully Registered" );
    }
  } catch (err) {
    res.send(err);
  }
});

app.get("/companydata", async (req, res) => {
  try {
    
    const users = await User3.find({ status: 'no' });
    // console.log(users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.patch("/companydata/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const newStatus = req.body.status;
    console.log(newStatus);
    const user = await User3.findOneAndUpdate({ email }, { status: newStatus }, { new: true });
    
    console.log(`Status for ${email} updated to ${newStatus}`);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});


const userSchema4 = new mongoose.Schema({
  email: String,
});

const User4 = new mongoose.model("user4", userSchema4);

app.post("/addmem", async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  try {
    const user4 = await User4.findOne({ email: email });
    if (user4) {
      res.send({ message: "Already Added! " });
    } else {
      const user4 = await User.findOne({ email: email });
      if (user4) {
        const newUser = new User4({
          email,
        });
        await newUser.save();
        res.send({ message: "Added Successfully !!" });
        logger.info("Added Successfully !!");
      } else {
        res.send({ message: "Not Found" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/getallcourior", async (req, res) => {
  try {
    const users = await User3.find({});
    logger.info("Goes courior data to frontend");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/memornot/get-details/:email", async (req, res) => {
  const em = req.params.email;
  console.log(em);
  const user4 = await User4.findOne({ email: em });
  if (user4) {
    res.send({ message: "True" });
    // logger.info("");
  } else {
    res.send({ message: "False" });
  }
});

app.delete("/courior/delete/:email", async (req, res) => {
  const em = req.params.email;
  console.log(em);
  try {
    const user = await User3.findOneAndDelete({ email: em });
    logger.info("Now courior is deleted from List");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(9002, () => {
  console.log("started at port 9002");
});
