/* Example for converting a .fit file into .gpx */

const fs = require('fs');
const sportsLibPkg = require('@sports-alliance/sports-lib');
const exporterPkg = require('@sports-alliance/sports-lib/lib/events/adapters/exporters/exporter.gpx.js')

const { SportsLib } = sportsLibPkg;
const { EventExporterGPX } = exporterPkg;

function convertFitToGpx(inputFilePath: string, outputGpxFilePath: string) {
  // reads the FIT file into memory
  const inputFile = fs.readFileSync(inputFilePath, null);
  if (!inputFile || !inputFile.buffer) {
    console.error(
      "Ooops, could not read the inputFile or it does not exists, see details below"
    );
    console.error(JSON.stringify(inputFilePath));
    return;
  }
  const inputFileBuffer = inputFile.buffer;
  // uses lib to read the FIT file
  SportsLib.importFromFit(inputFileBuffer).then((event) => {
    // convert to gpx
    const gpxPromise = new EventExporterGPX().getAsString(event);
    gpxPromise
      .then((gpxString) => {
        // writes the gpx to file
        try {
          fs.writeFileSync(outputGpxFilePath, gpxString);
        } catch (wError) {
          if (wError) {
            console.error(
              "Ooops, something went wrong while saving the GPX file, see details below."
            );
            console.error(JSON.stringify(wError));
          }
        }

        // all done, celebrate!
        console.log("Converted FIT file to GPX successfully!");
        console.log("GPX file saved here: " + outputGpxFilePath);
      })
      .catch((cError) => {
        console.error(
          "Ooops, something went wrong while converting the FIT file, see details below"
        );
        console.error(JSON.stringify(cError));
      });
  });
}

// Input and output file path
const inputFilePath = "./input/Example_SpeedCoachSUPWorkout.fit";
const outputGpxFilePath = "./output/Example_SpeedCoachSUPWorkout.gpx";

convertFitToGpx(inputFilePath, outputGpxFilePath);
