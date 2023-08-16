import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highmaps';
import topology from "@highcharts/map-collection/custom/world.topo.json";

@Component({
  selector: 'app-investigator-by-country',
  templateUrl: './investigator-by-country.component.html',
  styleUrls: ['./investigator-by-country.component.scss']
})

export class InvestigatorByCountryComponent {
  loader: boolean = false;
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor = "mapChart";

  chartOptions: Highcharts.Options = {
    chart: {
      map: topology
    },
    colors: ['rgba(19,64,117,0.05)', 'rgba(19,64,117,0.2)', 'rgba(19,64,117,0.4)',
      'rgba(19,64,117,0.5)', 'rgba(19,64,117,0.6)', 'rgba(19,64,117,0.8)', 'rgba(19,64,117,1)'],
    title: {
      text: 'Population density by country (/km²)',
      align: 'left'
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        align: 'right'
      }
    },
    mapView: {
      fitToGeometry: {
        type: 'MultiPoint',
        coordinates: [
          // Alaska west
          [-164, 54],
          // Greenland north
          [-35, 84],
          // New Zealand east
          [179, -38],
          // Chile south
          [-68, -55]
        ]
      }
    },
    legend: {
      title: {
        text: 'Individuals per km²',
        style: {
          color: ( // theme
            Highcharts.defaultOptions &&
            Highcharts.defaultOptions.legend &&
            Highcharts.defaultOptions.legend.title &&
            Highcharts.defaultOptions.legend.title.style &&
            Highcharts.defaultOptions.legend.title.style.color
          ) || 'black'
        }
      },
      align: 'left',
      verticalAlign: 'bottom',
      floating: true,
      layout: 'vertical',
      valueDecimals: 0,
      backgroundColor: ( // theme
        Highcharts.defaultOptions &&
        Highcharts.defaultOptions.legend &&
        Highcharts.defaultOptions.legend.backgroundColor
      ) || 'rgba(255, 255, 255, 0.85)',
      symbolRadius: 0,
      symbolHeight: 14
    },
    colorAxis: {
      dataClasses: [{
        to: 3
      }, {
        from: 3,
        to: 10
      }, {
        from: 10,
        to: 30
      }, {
        from: 30,
        to: 100
      }, {
        from: 100,
        to: 300
      }, {
        from: 300,
        to: 1000
      }, {
        from: 1000
      }]
    },
    series: [
      {
        type: "map",
        name: "Random data",
        states: {
          hover: {
            color: "#BADA55"
          }
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}"
        },
        allAreas: false,
        data: [
          ["fo", 0],
          ["um", 1],
          ["us", 2],
          ["jp", 3],
          ["sc", 4],
          ["in", 5],
          ["fr", 6],
          ["fm", 7],
          ["cn", 8],
          ["pt", 9],
          ["sw", 10],
          ["sh", 11],
          ["br", 12],
          ["ki", 13],
          ["ph", 14],
          ["mx", 15],
          ["es", 16],
          ["bu", 17],
          ["mv", 18],
          ["sp", 19],
          ["gb", 20],
          ["gr", 21],
          ["as", 22],
          ["dk", 23],
          ["gl", 24],
          ["gu", 25],
          ["mp", 26],
          ["pr", 27],
          ["vi", 28],
          ["ca", 29],
          ["st", 30],
          ["cv", 31],
          ["dm", 32],
          ["nl", 33],
          ["jm", 34],
          ["ws", 35],
          ["om", 36],
          ["vc", 37],
          ["tr", 38],
          ["bd", 39],
          ["lc", 40],
          ["nr", 41],
          ["no", 42],
          ["kn", 43],
          ["bh", 44],
          ["to", 45],
          ["fi", 46],
          ["id", 47],
          ["mu", 48],
          ["se", 49],
          ["tt", 50],
          ["my", 51],
          ["pa", 52],
          ["pw", 53],
          ["tv", 54],
          ["mh", 55],
          ["cl", 56],
          ["th", 57],
          ["gd", 58],
          ["ee", 59],
          ["ag", 60],
          ["tw", 61],
          ["bb", 62],
          ["it", 63],
          ["mt", 64],
          ["vu", 65],
          ["sg", 66],
          ["cy", 67],
          ["lk", 68],
          ["km", 69],
          ["fj", 70],
          ["ru", 71],
          ["va", 72],
          ["sm", 73],
          ["kz", 74],
          ["az", 75],
          ["tj", 76],
          ["ls", 77],
          ["uz", 78],
          ["ma", 79],
          ["co", 80],
          ["tl", 81],
          ["tz", 82],
          ["ar", 83],
          ["sa", 84],
          ["pk", 85],
          ["ye", 86],
          ["ae", 87],
          ["ke", 88],
          ["pe", 89],
          ["do", 90],
          ["ht", 91],
          ["pg", 92],
          ["ao", 93],
          ["kh", 94],
          ["vn", 95],
          ["mz", 96],
          ["cr", 97],
          ["bj", 98],
          ["ng", 99],
          ["ir", 100],
          ["sv", 101],
          ["sl", 102],
          ["gw", 103],
          ["hr", 104],
          ["bz", 105],
          ["za", 106],
          ["cf", 107],
          ["sd", 108],
          ["cd", 109],
          ["kw", 110],
          ["de", 111],
          ["be", 112],
          ["ie", 113],
          ["kp", 114],
          ["kr", 115],
          ["gy", 116],
          ["hn", 117],
          ["mm", 118],
          ["ga", 119],
          ["gq", 120],
          ["ni", 121],
          ["lv", 122],
          ["ug", 123],
          ["mw", 124],
          ["am", 125],
          ["sx", 126],
          ["tm", 127],
          ["zm", 128],
          ["nc", 129],
          ["mr", 130],
          ["dz", 131],
          ["lt", 132],
          ["et", 133],
          ["er", 134],
          ["gh", 135],
          ["si", 136],
          ["gt", 137],
          ["ba", 138],
          ["jo", 139],
          ["sy", 140],
          ["mc", 141],
          ["al", 142],
          ["uy", 143],
          ["cnm", 144],
          ["mn", 145],
          ["rw", 146],
          ["so", 147],
          ["bo", 148],
          ["cm", 149],
          ["cg", 150],
          ["eh", 151],
          ["rs", 152],
          ["me", 153],
          ["tg", 154],
          ["la", 155],
          ["af", 156],
          ["ua", 157],
          ["sk", 158],
          ["jk", 159],
          ["bg", 160],
          ["qa", 161],
          ["li", 162],
          ["at", 163],
          ["sz", 164],
          ["hu", 165],
          ["ro", 166],
          ["ne", 167],
          ["lu", 168],
          ["ad", 169],
          ["ci", 170],
          ["lr", 171],
          ["bn", 172],
          ["iq", 173],
          ["ge", 174],
          ["gm", 175],
          ["ch", 176],
          ["td", 177],
          ["kv", 178],
          ["lb", 179],
          ["dj", 180],
          ["bi", 181],
          ["sr", 182],
          ["il", 183],
          ["ml", 184],
          ["sn", 185],
          ["gn", 186],
          ["zw", 187],
          ["pl", 188],
          ["mk", 189],
          ["py", 190],
          ["by", 191],
          ["cz", 192],
          ["bf", 193],
          ["na", 194],
          ["ly", 195],
          ["tn", 196],
          ["bt", 197],
          ["md", 198],
          ["ss", 199],
          ["bw", 200],
          ["bs", 201],
          ["nz", 202],
          ["cu", 203],
          ["ec", 204],
          ["au", 205],
          ["ve", 206],
          ["sb", 207],
          ["mg", 208],
          ["is", 209],
          ["eg", 210],
          ["kg", 211],
          ["np", 212],
          ["gum",302],
          ["grd",316],
          ["abw",512],
          ["gib",3441],
          ["sgp",7909],
          ["mco",19250],
          ["mac",20406]
        ]
      }
    ]
  };
}