import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { message } from 'antd'
import { jsPDF } from 'jspdf'
import { get1v1HeatmapsByCategory } from '../../utils/heatmap1v1'

function Download1v1ReportButton() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const individualResult = useSelector((state) => state.analyze.individualResult)
  const individualUploads = useSelector((state) => state.analyze.individualUploads)

  const similarity = Number(individualResult?.similarity_percentage ?? 0)
  const judgmentMsg = individualResult?.is_same_entity ? 'The same entity' : 'Different entities'
  const imageA = individualUploads?.imgA
  const imageB = individualUploads?.imgB
  const category = individualResult?.category
  const heatmaps = get1v1HeatmapsByCategory(category)
  const heatmapA = heatmaps?.imgB
  const heatmapB = heatmaps?.imgA

  const ensurePageSpace = (doc, y, requiredHeight, margin = 15) => {
    if (y + requiredHeight > 297 - margin) {
      doc.addPage()
      return margin
    }
    return y
  }

  const drawSectionTitle = (doc, text, y, margin = 15) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(text, margin, y)
    return y + 6
  }

  const drawLabelValue = (doc, label, value, y, margin = 15) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`${label}:`, margin, y)
    doc.setFont('helvetica', 'normal')
    const text = value === null || value === undefined || value === '' ? 'N/A' : String(value)
    const wrapped = doc.splitTextToSize(text, 120)
    doc.text(wrapped, margin + 45, y)
    return y + wrapped.length * 5 + 2
  }

  const loadImageSize = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.width, height: img.height })
      img.onerror = () => reject(new Error('image_load_error'))
      img.src = src
    })

  const drawImageCard = async (doc, src, title, x, y, cardWidth, cardHeight) => {
    doc.setDrawColor(210, 210, 210)
    doc.rect(x, y, cardWidth, cardHeight)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(title, x + 3, y + 5)

    if (!src) {
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(140, 140, 140)
      doc.text('No preview available', x + 3, y + cardHeight / 2)
      doc.setTextColor(0, 0, 0)
      return
    }

    try {
      const { width, height } = await loadImageSize(src)
      const imageFormat = src.includes('image/png') ? 'PNG' : 'JPEG'
      const imageMaxWidth = cardWidth - 6
      const imageMaxHeight = cardHeight - 12
      const ratio = Math.min(imageMaxWidth / width, imageMaxHeight / height)
      const drawWidth = width * ratio
      const drawHeight = height * ratio
      const drawX = x + (cardWidth - drawWidth) / 2
      const drawY = y + 8 + (imageMaxHeight - drawHeight) / 2
      doc.addImage(src, imageFormat, drawX, drawY, drawWidth, drawHeight)
    } catch {
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(180, 0, 0)
      doc.text('Image render failed', x + 3, y + cardHeight / 2)
      doc.setTextColor(0, 0, 0)
    }
  }

  const handleDownloadReport = async () => {
    if (!individualResult) {
      message.warning('暂无可导出的1v1分析结果')
      return
    }

    setIsGeneratingReport(true)
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })
      const margin = 15
      let y = margin
      const now = new Date()
      const reportTime = now.toLocaleString('zh-CN')
      const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('1v1 Recognition Analysis Report', margin, y)
      y += 8

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(`Generated At: ${reportTime}`, margin, y)
      y += 8

      y = ensurePageSpace(doc, y, 65, margin)
      y = drawSectionTitle(doc, 'Uploaded Image Evidence', y, margin)
      await drawImageCard(doc, imageA, 'Probe Image A', margin, y, 85, 58)
      await drawImageCard(doc, imageB, 'Probe Image B', margin + 95, y, 85, 58)
      y += 65

      y = ensurePageSpace(doc, y, 65, margin)
      y = drawSectionTitle(doc, 'Heatmap Evidence', y, margin)
      await drawImageCard(doc, heatmapA, 'Heatmap A', margin, y, 85, 58)
      await drawImageCard(doc, heatmapB, 'Heatmap B', margin + 95, y, 85, 58)
      y += 65

      y = ensurePageSpace(doc, y, 70, margin)
      y = drawSectionTitle(doc, 'Core Analysis Result', y, margin)
      y = drawLabelValue(doc, 'Mode', '1v1', y, margin)
      y = drawLabelValue(doc, 'Category', individualResult?.category || 'N/A', y, margin)
      y = drawLabelValue(doc, 'Similarity Percentage', `${similarity.toFixed(2)}%`, y, margin)
      y = drawLabelValue(doc, 'Raw Cosine Similarity', individualResult?.raw_cosine_similarity, y, margin)
      y = drawLabelValue(doc, 'Same Entity', individualResult?.is_same_entity ? 'YES' : 'NO', y, margin)
      y = drawLabelValue(doc, 'Judgment', judgmentMsg, y, margin)

      y = ensurePageSpace(doc, y, 50, margin)
      y = drawSectionTitle(doc, 'Interpretation', y, margin)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      const interpretation = [
        'This report is generated from the current 1v1 verification response.',
        'A higher similarity score indicates a higher probability that both images belong to the same biological entity.',
        'Final decision should be reviewed together with domain-specific evidence when needed.'
      ]
      const lines = doc.splitTextToSize(interpretation.join(' '), 180)
      doc.text(lines, margin, y)

      doc.save(`1v1-analysis-report-${timestamp}.pdf`)
      message.success('分析报告已下载')
    } catch (error) {
      console.error('PDF生成失败:', error)
      message.error('分析报告生成失败，请重试')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  return (
    <button
      type='button'
      onClick={handleDownloadReport}
      disabled={isGeneratingReport}
      className={`custom-button w-75 border-0 mt-4 ${isGeneratingReport ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      {isGeneratingReport ? '报告生成中...' : '下载分析报告'}
    </button>
  )
}

export default Download1v1ReportButton
