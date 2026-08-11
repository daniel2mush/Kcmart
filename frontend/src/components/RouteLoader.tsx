import PageLoader from '#/components/PageLoader'
import { useGSAP } from '@gsap/react'
import { useRouterState } from '@tanstack/react-router'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

gsap.registerPlugin(useGSAP)

const MIN_LOADER_TIME = 750

const waitForPageAssets = () => {
  const waitForFonts =
    'fonts' in document
      ? document.fonts.ready.then(() => undefined)
      : Promise.resolve()

  const waitForImages = Array.from(document.images).map(
    (image) =>
      new Promise<void>((resolve) => {
        if (image.complete) {
          resolve()
          return
        }

        image.onload = () => resolve()
        image.onerror = () => resolve()
      }),
  )

  const assetsPromise = Promise.all([waitForFonts, ...waitForImages]).then(
    () => undefined,
  )
  const timeoutPromise = new Promise<void>((resolve) =>
    window.setTimeout(resolve, 500),
  )

  return Promise.race([assetsPromise, timeoutPromise])
}

const RouteLoader = () => {
  const isRouteLoading = useRouterState({
    select: (state) => state.isLoading,
  })
  const loaderRef = useRef<HTMLDivElement>(null)
  const loadingStartedAtRef = useRef(Date.now())
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    Promise.all([
      waitForPageAssets(),
      new Promise((resolve) => window.setTimeout(resolve, MIN_LOADER_TIME)),
    ]).then(() => {
      setIsInitialLoad(false)
    })
  }, [])

  useEffect(() => {
    if (isRouteLoading) {
      loadingStartedAtRef.current = Date.now()
      if (!isInitialLoad) {
        setIsVisible(true)
      }
      return
    }

    if (isInitialLoad) return

    const elapsed = Date.now() - loadingStartedAtRef.current
    const delay = Math.max(0, MIN_LOADER_TIME - elapsed)
    const timeout = window.setTimeout(() => {
      waitForPageAssets().then(() => {
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 0.75,
          ease: 'power3.inOut',
          onComplete: () => setIsVisible(false),
        })
      })
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [isInitialLoad, isRouteLoading])

  useGSAP(
    () => {
      if (!isVisible || !loaderRef.current) return

      gsap.set(loaderRef.current, { yPercent: 0 })
      gsap.fromTo(
        loaderRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.2, ease: 'power2.out' },
      )
    },
    { scope: loaderRef, dependencies: [isVisible] },
  )

  if (!isVisible) return null

  return (
    <div ref={loaderRef}>
      <PageLoader />
    </div>
  )
}

export default RouteLoader
