const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const upload = require("../middleware/upload");


router.post('/create', async (req, res) => {
  const { from, to, content, openAt,imageUrl } = req.body;

  
  if (!from || !to || !content || !openAt) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const message = new Message({
      from,
      to,
      content,
      openTime: new Date(openAt), 
       imageUrl: imageUrl || null,
    });

    await message.save();
    res.status(201).json({ message: 'Message scheduled successfully' });
  } catch (err) {
    console.error('Error creating message:', err);
    res.status(500).json({ error: 'Server error while scheduling message' });
  }
});



router.patch('/messages/open/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { isOpened: true });
    res.status(200).json({ message: "Message marked as opened" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const User = require('../models/User');

router.get('/inbox/:uid', async (req, res) => {
  try {
    const now = new Date();
    const { search, startDate, endDate, isOpened, includeDeleted } = req.query;

    
    const filter = {
      to: req.params.uid,
      openTime: { $lte: now },
    };

    if (includeDeleted !== "true") {
      filter.deletedFromInbox = false;
    }

    if (search) {
      filter.content = { $regex: search, $options: "i" };
    }

    if (startDate || endDate) {
      filter.createdTime = {};
      if (startDate) filter.createdTime.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdTime.$lte = end;
      }
    }

    if (isOpened === "true") {
      filter.isOpened = true;
    } else if (isOpened === "false") {
      filter.isOpened = false;
    }

    
    const messages = await Message.find(filter).lean(); 

    
    const fromUids = messages.map(msg => msg.from);
    const reactionUids = [];

    messages.forEach(msg => {
      if (msg.reactions) {
        Object.values(msg.reactions).forEach(arr => reactionUids.push(...arr));
      }
    });

    const uniqueUids = [...new Set([...fromUids, ...reactionUids])];

    
    const users = await User.find({ uid: { $in: uniqueUids } }, 'uid email');
    const uidToEmail = {};
    users.forEach(user => {
      uidToEmail[user.uid] = user.email;
    });

    
    const enrichedMessages = messages.map(msg => {
      const enrichedReactions = {};
      for (const [emoji, ids] of Object.entries(msg.reactions || {})) {
        enrichedReactions[emoji] = ids.map(uid => uidToEmail[uid] || uid);
      }

      return {
        ...msg,
        senderEmail: uidToEmail[msg.from] || "Unknown",
        reactions: enrichedReactions
      };
    });

    res.json(enrichedMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching inbox' });
  }
});


router.get('/sent/:uid', async (req, res) => {
  try {
    const { search, startDate, endDate, openTime, isOpened } = req.query;
    const filter = { from: req.params.uid };

    if (search) {
      filter.content = { $regex: search, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.createdTime = {};
      if (startDate) filter.createdTime.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        filter.createdTime.$lt = end;
      }
    }

    if (openTime) {
      filter.openTime = { $lt: new Date(openTime) };
    }

    if (isOpened === 'true') filter.isOpened = true;
    else if (isOpened === 'false') filter.isOpened = false;

    const messages = await Message.find(filter).lean();

    
    const toUids = messages.map(msg => msg.to);
    const reactionUids = [];
    messages.forEach(msg => {
      if (msg.reactions) {
        Object.values(msg.reactions).forEach(arr => reactionUids.push(...arr));
      }
    });
    const allUids = [...new Set([...toUids, ...reactionUids])];

    
    const users = await User.find({ uid: { $in: allUids } }, 'uid email');
    const uidToEmailMap = {};
    users.forEach(user => {
      uidToEmailMap[user.uid] = user.email;
    });

    
    const enrichedMessages = messages.map(msg => {
      const enrichedReactions = {};
      for (const [emoji, ids] of Object.entries(msg.reactions || {})) {
        enrichedReactions[emoji] = ids.map(uid => uidToEmailMap[uid] || uid);
      }

      return {
        ...msg,
        recipientEmail: uidToEmailMap[msg.to] || msg.to,
        reactions: enrichedReactions,
      };
    });

    res.json(enrichedMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching sent messages' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.isOpened) {
      return res.status(400).json({ error: 'Cannot delete message that has already been opened' });
    }

    await message.deleteOne();
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.patch('/open/:id', async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { isOpened: true });
    res.status(200).json({ message: 'Message marked as opened' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark message as opened' });
  }
});



router.patch('/inbox/delete/:id', async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(req.params.id, { deletedFromInbox: true },{new:true});
if (!updated) {
  return res.status(404).json({ error: 'Message not found' });
}

    console.log("Moved to bin:", req.params.id);
    res.json({ message: 'Moved to bin' });
  } catch (err) {
    console.error("Error moving to bin:", err);
    res.status(500).json({ error: 'Error deleting message from inbox' });
  }
});


router.get('/bin/:uid', async (req, res) => {
  try {
    const now = new Date();

  
    const messages = await Message.find({
      to: req.params.uid,
      openTime: { $lte: now },
      deletedFromInbox: true,
    });

    
    const fromUids = [...new Set(messages.map(msg => msg.from))];

    
    const users = await User.find({ uid: { $in: fromUids } });

  
    const uidToEmail = {};
    users.forEach(user => {
      uidToEmail[user.uid] = user.email;
    });

    
    const enrichedMessages = messages.map(msg => ({
      ...msg._doc,
      senderEmail: uidToEmail[msg.from] || "Unknown",
    }));

    console.log("Fetched messages for bin:", enrichedMessages.length);
    res.json(enrichedMessages);
  } catch (err) {
    console.error("Error fetching bin:", err);
    res.status(500).json({ error: 'Error fetching bin' });
  }
});

router.patch('/restore/:id', async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { deletedFromInbox: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Message not found' });
    }

    console.log("Restored message:", req.params.id);
    res.json({ message: 'Message restored' });
  } catch (err) {
    console.error("Error restoring message:", err);
    res.status(500).json({ error: 'Error restoring message' });
  }
});


router.delete('/permanent/:id', async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    console.log("Permanently deleted message:", req.params.id);
    res.json({ message: 'Message permanently deleted' });
  } catch (err) {
    console.error("Error permanently deleting message:", err);
    res.status(500).json({ error: 'Error permanently deleting message' });
  }
});
router.patch('/update/:id', async (req, res) => {
  try {
    const { content } = req.body;
    await Message.findByIdAndUpdate(req.params.id, { content });
    res.json({ message: 'Message updated successfully' });
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.post('/:id/react', async (req, res) => {
  const { emoji, userId } = req.body;

  const message = await Message.findById(req.params.id);
  if (!message) return res.status(404).send("Message not found");

  if (!message.reactions.has(emoji)) {
    message.reactions.set(emoji, []);
  }

  const reacted = message.reactions.get(emoji);
  if (reacted.includes(userId)) {
    
    message.reactions.set(emoji, reacted.filter(uid => uid !== userId));
  } else {

    message.reactions.set(emoji, [...reacted, userId]);
  }

  await message.save();
  res.status(200).send("Reaction updated");
});
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded or URL missing" });
    }

    res.status(200).json({ url: req.file.path }); 
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
});
module.exports = router;


