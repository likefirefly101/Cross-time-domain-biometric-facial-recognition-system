import React, { useState, useRef, useEffect, useTransition } from 'react';

/**
 * 通用编辑组件
 * @param {string} label - 标题（如：昵称）
 * @param {string} value - 当前显示的值
 * @param {string} type - 输入框类型 (text 或 password)
 * @param {boolean} editable - 是否允许编辑
 * @param {function} onSave - 保存回调，支持异步函数
 */
const EditableItem = ({ label, value, type = 'text', editable = true, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isPending, startTransition] = useTransition(); // React 19 处理异步请求状态
  const inputRef = useRef(null);

  // 进入编辑状态时自动聚焦
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setTempValue(value);
    }
  }, [value, isEditing]);

  const handleSave = () => {
    if (tempValue === value) {
      setIsEditing(false);
      return;
    }

    // startTransition 会自动追踪异步操作的完成状态
    startTransition(async () => {
      try {
        if (onSave) {
          await onSave(tempValue);
        }
        setIsEditing(false);
      } catch (error) {
        console.error("保存失败:", error);
      }
    });
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="group flex flex-col items-start w-full py-5 border-b border-gray-100 transition-all">
      {/* 顶部标签 */}
      <label className="font-normal text-sm text-[#4C4C4C] text-left mb-2">{label}</label>

      <div className="relative flex items-center justify-between w-full min-h-8">
        {isEditing ? (
          <div className="flex items-center w-full gap-3">
            <input
              ref={inputRef}
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              disabled={isPending}
              className="flex-1 bg-transparent border-b border-blue-500 outline-none py-1 text-gray-700 font-normal text-xs text-left transition-all disabled:opacity-50"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isPending}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {isPending ? "保存中..." : "确定"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="text-sm font-semibold text-gray-400 hover:text-gray-600"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 内容展示层 */}
            <span className="ml-5 font-normal text-xs text-[#949494] text-left; font-family: Microsoft YaHei, Microsoft YaHei">
              {type === 'password' ? '••••••' : value || '未设置'}
            </span>

            {/* 编辑图标 (仅在可编辑且鼠标悬停时显示) */}
            {editable && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-300 hover:text-gray-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <EditIcon />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// 简单的 SVG 编辑图标组件
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
  </svg>
);

export default EditableItem;