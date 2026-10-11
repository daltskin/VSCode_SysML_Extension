package ThermalSafety {
  requirement safeTemperature {
    doc /* The system shall detect excessive temperature and stop heating. */
  }
  requirement sensorAvailability {
    doc /* Temperature measurements shall remain available during operation. */
  }
  part temperatureSensor {
    port reading;
  }
  part safetyController {
    port temperatureInput;
    action evaluateTemperature;
    state monitoring;
    constraint operatingLimit;
  }
  part unrelatedIndicator;
  connection sensorLink connect temperatureSensor.reading to safetyController.temperatureInput {
    doc /* Carries the measured temperature to the controller for over-temperature protection. */
  }
  dependency from ThermalSafety::safetyController to ThermalSafety::temperatureSensor;
  satisfy ThermalSafety::safeTemperature by ThermalSafety::safetyController;
  satisfy ThermalSafety::sensorAvailability by ThermalSafety::temperatureSensor;
  verification temperatureTest {
    objective { verify ThermalSafety::safeTemperature; }
  }
}
