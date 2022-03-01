import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

class PatientWeeklyCount extends React.Component {
  render() {
    const data = [
      {
        day: "Sun",
        patientCount: 38
      },
      {
        day: "Mon",
        patientCount: 38
      },
      {
        day: "Tue",
        patientCount: 52
      },
      {
        day: "Wen",
        patientCount: 61
      },
      {
        day: "Thur",
        patientCount: 145
      },
      {
        day: "Fri",
        patientCount: 48
      },
      {
        day: "Sat",
        patientCount: 38
      },
    ];
    const cols = {
      patientCount: {
        tickInterval: 20
      }
    };
    return (
      <div>
        <Chart height={400} data={data} scale={cols} forceFit>
          <Axis name="day" />
          <Axis name="patientCount" />
          {/* <Legend position="top" /> */}
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="interval" position="day*patientCount" color="day" />
        </Chart>
      </div>
    );
  }
}

export default PatientWeeklyCount;