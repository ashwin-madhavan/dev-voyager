// import express from 'express';
// import ffmpeg from 'fluent-ffmpeg';

// const app = express();
// app.use(express.json());


// app.post('/process-video', (req, res) => {

//   // Get the path of the input video file from the request body
//   const inputFilePath = req.body.inputFilePath;
//   const outputFilePath = req.body.outputFilePath;

//   // Check if the input file path is defined
//   if (!inputFilePath || !outputFilePath) {
//     return res.status(400).send('Bad Request: Missing file path');
//   }

//   // Create the ffmpeg command
//   ffmpeg(inputFilePath)
//     .outputOptions('-vf', 'scale=-1:360') // 360p
//     .on('end', function() {
//         console.log('Processing finished successfully');
//         res.status(200).send('Processing finished successfully');
//     })
//     .on('error', function(err: any) {
//         console.log('An error occurred: ' + err.message);
//         res.status(500).send('An error occurred: ' + err.message);
//     })
//     .save(outputFilePath);
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

app.post('/process-git', (req, res) => {
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
    return res.status(400).json({ error: 'File path not provided.' });
  }

  // Command to generate Gource visualization and save as .mp4
  const gourceCommand = `xvfb-run gource -1280x720 -o - ${inputFilePath} | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 18 -threads 0 -bf 0 ${outputFilePath}`;



  // Execute the command
  exec(gourceCommand, (error, stdout, stderr) => {
    if (error) {
        return res.status(500).json({ error: 'Failed to generate Gource visualization!', stderr });
    }

    // Gource visualization successfully created
    return res.status(200).json({ message: 'Gource visualization created and saved as gource.mp4.' });
  });
});

const PORT = 3000; // Set the desired port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

