'use client'
import { useState, useEffect } from 'react'
import { X, ArrowLeftCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdContainerProps {
  client: string
  slot: string
  width?: number
  className?: string
}

export const AdContainer = ({
  client,
  slot,
  width = 200,
  className,
}: AdContainerProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    // 从本地存储中获取广告显示状态
    const savedState = localStorage.getItem('adContainerVisible')
    if (savedState !== null) {
      setIsVisible(savedState === 'true')
    }
  }, [])

  useEffect(() => {
    // 保存广告显示状态到本地存储
    localStorage.setItem('adContainerVisible', isVisible.toString())

    // 当广告可见时，加载广告
    if (isVisible && !isHidden) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense 错误:', err)
      }
    }
  }, [isVisible, isHidden])

  // 处理隐藏动画完成后真正隐藏元素
  const handleTransitionEnd = () => {
    if (!isVisible) {
      setIsHidden(true)
    }
  }

  // 处理显示广告
  const handleShow = () => {
    setIsHidden(false)
    setIsVisible(true)
  }

  return (
    <>
      {/* 悬浮广告容器 */}
      <div
        className={cn(
          'fixed right-0 top-24 z-50 flex flex-col transition-all duration-300',
          isVisible ? 'translate-x-0' : 'translate-x-full',
          className
        )}
        style={{ width: `${width}px` }}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {/* 控制按钮 */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 left-2 z-10 p-1 bg-white/80 dark:bg-gray-700/80 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="隐藏广告"
          >
            <X size={16} />
          </button>
          {/* 显示按钮 - 当广告被隐藏时显示 */}
          {!isVisible && (
            <button
              onClick={handleShow}
              className="absolute -left-8 top-2 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="显示广告"
            >
              <ArrowLeftCircle size={16} />
            </button>
          )}

          {/* 广告内容 */}
          {!isHidden && (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: `${width}px`, height: 'auto' }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format="auto"
              data-full-width-responsive="false"
            />
          )}
        </div>
      </div>
    </>
  )
}
