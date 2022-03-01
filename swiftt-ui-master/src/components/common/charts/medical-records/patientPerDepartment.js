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
import { DataSet } from "@antv/data-set";


class patientPertDepartment extends React.Component {
  render() {
    const data = [
      {
        department: "Laboratory",
        population: 221
      },
      {
        department: "Pharmacy",
        population: 104
      },
      {
        department: "Physician",
        population: 190
      },
      {
        department: "Policlinic",
        population: 234
      },
      {
        department: "Gastro & KNO",
        population: 182
      },
      {
        department: "Sleep Centre",
        population: 123
      },
      {
        department: "Radiology",
        population: 145
      }
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.source(data).transform({
      type: "sort",

      callback(a, b) {
        // 排序依据，和原生js的排序callback一致
        return a.population - b.population > 0;
      }
    });
    return (
      <div>
        <Chart height={400} data={dv} forceFit>
          <Coord transpose />
          <Axis

            name="department"
            label={{
              offset: 5,
              textStyle: {
                // textAlign: 'center', // 文本对齐方向，可取值为： start center end
                // fill: '#404040', // 文本的颜色
                fontSize: '10', // 文本大小
                fontWeight: 'bold', // 文本粗细
                // rotate: 30,
                // textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
              }
            }}
          />
          <Axis name="population" />
          <Tooltip />
          <Geom type="interval" position="department*population" color="department" />
        </Chart>
      </div>
    );
  }
}

export default patientPertDepartment;