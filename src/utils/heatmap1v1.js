import humanHeatmapA from '../assets/heatMap/human/1v1/people_9751_TomJones_22_f_monkey.png'
import humanHeatmapB from '../assets/heatMap/human/1v1/people_9788_TomJones_74_f_monkey.png'
import mandrillusHeatmapA from '../assets/heatMap/mandrillus/1v1/mandrillus_20180703_id268_age0_face.png'
import mandrillusHeatmapB from '../assets/heatMap/mandrillus/1v1/mandrillus_20211217_id268_age3_face.png'

const HEATMAP_1V1_MAP = {
  human: {
    imgA: humanHeatmapA,
    imgB: humanHeatmapB,
  },
  mandrillus: {
    imgA: mandrillusHeatmapA,
    imgB: mandrillusHeatmapB,
  },
}

export function get1v1HeatmapsByCategory(category) {
  return HEATMAP_1V1_MAP[category] || null
}
