export const manifest = {
  screens: {
    scr_zj0mhw: { name: "Hero", route: "/#product", position: { "x": 160, "y": 220 } },
    scr_b1qlf7: { name: "Core Modules", route: "/#modules", position: { "x": 2960, "y": 220 } },
    scr_0upewv: { name: "Value Props", route: "/#how-it-works", position: { "x": 1560, "y": 220 } },
    scr_wodit3: { name: "Reporting", route: "/#reporting", position: { "x": 4360, "y": 220 } }
  },
  sections: {
    sec_8lzmgs: { name: "Product Landing Page", x: 0, y: 0, width: 5720, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_8lzmgs", children: [
    { kind: "screen", id: "scr_zj0mhw" },
    { kind: "screen", id: "scr_0upewv" },
    { kind: "screen", id: "scr_b1qlf7" },
    { kind: "screen", id: "scr_wodit3" }]
  }]

};