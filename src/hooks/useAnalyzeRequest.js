import { useDispatch, useSelector } from 'react-redux';
import { analyzeIndividualApi, analyzeTeamApi } from '../api/analyzeApi';
import { MANNER_API_MAP, SPECIES_API_MAP } from '../store/selectSlice';
import { message } from 'antd';
import { setIndividualResult, setTeamResult } from '../store/analyzeSlice';

function extractAnalyzePayload(apiResponse) {
  if (!apiResponse) {
    return null;
  }

  // 当前拦截器成功时返回的是 response.data.data => { code, message, data }
  if (Object.prototype.hasOwnProperty.call(apiResponse, 'message') && Object.prototype.hasOwnProperty.call(apiResponse, 'data')) {
    return apiResponse.data;
  }

  // 兼容未脱壳或后端返回结构调整
  if (Object.prototype.hasOwnProperty.call(apiResponse, 'msg') && Object.prototype.hasOwnProperty.call(apiResponse, 'data')) {
    if (apiResponse.data && Object.prototype.hasOwnProperty.call(apiResponse.data, 'data')) {
      return apiResponse.data.data;
    }
    return apiResponse.data;
  }

  return apiResponse;
}

/**
 * 自定义 Hook：根据选择调用不同的分析 API
 * @returns {Object} - { handleAnalyze: Function, loading: boolean }
 */
export function useAnalyzeRequest() {
  const dispatch = useDispatch();
  const { currentManner, currentSpecies } = useSelector(state => state.select);

  const handleAnalyze = async (imageData) => {
    try {
      // 获取映射后的 API 参数
      const mannerType = MANNER_API_MAP[currentManner];
      const category = SPECIES_API_MAP[currentSpecies];

      if (!mannerType || !category) {
        message.error('选择参数无效');
        return null;
      }

      // 准备请求数据
      const requestData = {
        category,
        ...imageData,
      };

      // 根据不同的匹配方式调用不同的 API
      if (mannerType === 'individual') {
        // 一对一匹配：需要 imgA 和 imgB
        if (!imageData.imgA || !imageData.imgB) {
          message.error('一对一匹配需要上传两张图片');
          return null;
        }
        const response = await analyzeIndividualApi(requestData);
        const payload = extractAnalyzePayload(response);
        if (!payload) {
          message.error('未获取到有效的分析结果');
          return null;
        }
        dispatch(setIndividualResult(payload));
        return payload;
      } else if (mannerType === 'team') {
        // 数据库查询：只需要 img
        if (!imageData.img) {
          message.error('数据库查询需要上传一张图片');
          return null;
        }
        const response = await analyzeTeamApi(requestData);
        const payload = extractAnalyzePayload(response);
        if (!payload) {
          message.error('未获取到有效的分析结果');
          return null;
        }
        dispatch(setTeamResult(payload));
        return payload;
      }

      return null;
    } catch (error) {
      console.error('请求失败:', error);
      message.error(error.response?.data?.message || '请求失败，请重试');
      return null;
    }
  };

  return {
    handleAnalyze,
    currentManner,
    currentSpecies,
  };
}
