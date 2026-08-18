// src/lib/gsap.ts

export const getGSAP = async () => {
  const { gsap } = await import('gsap')
  return gsap
}
