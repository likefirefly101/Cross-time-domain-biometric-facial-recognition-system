import humanMostMatchedReturn from '../assets/returnMap/human/most-matched.png'
import humanReturn2 from '../assets/returnMap/human/7749_AlbertoSordi_29_m.jpg'
import humanReturn3 from '../assets/returnMap/human/7777_AlbertoSordi_69_m.jpg'
import humanReturn4 from '../assets/returnMap/human/8183_PatrickSwayze_55_m.jpg'
import humanReturn5 from '../assets/returnMap/human/8184_PatrickSwayze_57_m.jpg'

import humanMostMatchedHeatmap from '../assets/heatMap/human/1vN/most-matched.png'
import humanHeatmap2 from '../assets/heatMap/human/1vN/people_7749_AlbertoSordi_29_m_monkey.png'
import humanHeatmap3 from '../assets/heatMap/human/1vN/people_7777_AlbertoSordi_69_m_monkey.png'
import humanHeatmap4 from '../assets/heatMap/human/1vN/people_8183_PatrickSwayze_55_m_monkey.png'
import humanHeatmap5 from '../assets/heatMap/human/1vN/people_8184_PatrickSwayze_57_m_monkey.png'

import mandrillusMostMatchedReturn from '../assets/returnMap/most-matched.png'
import mandrillusReturn2 from '../assets/returnMap/7c2a7857158a2c9686a9c5879e9fa92f.png'
import mandrillusReturn3 from '../assets/returnMap/95af794799f4917b297155b188005281.png'
import mandrillusReturn4 from '../assets/returnMap/a4b6a3b9c50c4774849d4b3383731d49.png'
import mandrillusReturn5 from '../assets/returnMap/d129ab3b20dc4701810ed628defa4852.png'

import mandrillusMostMatchedHeatmap from '../assets/heatMap/mandrillus/1vN/most-matched-heatMap.png'
import mandrillusHeatmap2 from '../assets/heatMap/mandrillus/1vN/mandrillus_20120420_id140_3_age0_face.png'
import mandrillusHeatmap3 from '../assets/heatMap/mandrillus/1vN/mandrillus_20180613_id140_2_age6_face.png'
import mandrillusHeatmap4 from '../assets/heatMap/mandrillus/1vN/mandrillus_20201213_id6073_6_age0_face.png'
import mandrillusHeatmap5 from '../assets/heatMap/mandrillus/1vN/mandrillus_20210126_id236_2_age5_face.png'

const human1vNReturnMap = [
  humanMostMatchedReturn,
  humanReturn2,
  humanReturn3,
  humanReturn4,
  humanReturn5,
]

const human1vNHeatmaps = [
  humanMostMatchedHeatmap,
  humanHeatmap2,
  humanHeatmap3,
  humanHeatmap4,
  humanHeatmap5,
]

export const mandrillus1vNReturnMap = [
  mandrillusMostMatchedReturn,
  mandrillusReturn2,
  mandrillusReturn3,
  mandrillusReturn4,
  mandrillusReturn5,
]

export const mandrillus1vNHeatmaps = [
  mandrillusMostMatchedHeatmap,
  mandrillusHeatmap2,
  mandrillusHeatmap3,
  mandrillusHeatmap4,
  mandrillusHeatmap5,
]

export const human1vNAssets = {
  returnMap: human1vNReturnMap,
  heatmaps: human1vNHeatmaps,
}

export const mandrillus1vNAssets = {
  returnMap: mandrillus1vNReturnMap,
  heatmaps: mandrillus1vNHeatmaps,
}

export function get1vNAssetsByCategory(category) {
  if (category === 'human') {
    return human1vNAssets
  }

  if (category === 'mandrillus') {
    return mandrillus1vNAssets
  }

  return {
    returnMap: [],
    heatmaps: [],
  }
}
