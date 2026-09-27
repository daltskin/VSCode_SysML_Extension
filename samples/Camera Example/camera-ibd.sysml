package CameraTestIBD {
    private import CameraTestBDD::*;

    part def CameraSystemAssembly {
        part camera : CameraSystem {
            port powerIn {
                :>> voltage = 7.4;
                :>> current = 2.0;
            }

            part optics {
                :>> focalLengthMm = 35.0;
                :>> aperture = 1.8;
            }

            part imaging {
                :>> pixelCount = 24000000;
                :>> sensorType = "CMOS";
            }

            part controller {
                :>> firmwareVersion = "v2.1";
            }

            part power {
                :>> capacityMah = 2000;
                :>> healthPercent = 88.0;
            }
        }

        part gripBattery : PowerModule {
            :>> capacityMah = 1500;
            :>> healthPercent = 95.0;
        }

        //////////////////////////////////////////////////////////////////////
        // Connectors rendered on the IBD canvas
        //////////////////////////////////////////////////////////////////////

        connection powerFeed
            connect gripBattery to camera::power;

        connection lensToSensor
            connect camera::optics to camera::imaging;

        connection sensorPixels
            connect camera::imaging to camera::controller;

        connection outputLink
            connect camera::controller to camera::mediaOut;
    }

    part benchRig : CameraSystemAssembly;
}
