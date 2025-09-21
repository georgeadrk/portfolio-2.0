import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
}) => {
  const cursorRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const dotRef = useRef(null);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12,
      parallaxStrength: 0.00005,
    }),
    []
  );

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.09,
      ease: 'power3.out',
    });
  }, []);

  useEffect(() => {
    if (!cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    // State in closure
    let activeTarget = null;
    let currentTargetMove = null;
    let currentLeaveHandler = null;
    let isAnimatingToTarget = false;
    let resumeTimeout = null;

    // For speed-based shrink
    let prevX = null;
    let prevY = null;
    let idleTimeout = null;

    const cleanupTarget = (target) => {
      if (!target) return;
      if (currentTargetMove) {
        target.removeEventListener('mousemove', currentTargetMove);
      }
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentTargetMove = null;
      currentLeaveHandler = null;
    };

    // initial placement
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      scale: 1,
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };

    createSpinTimeline();

    // ---------- Global mouse move (moves cursor + speed-based shrink) ----------
    const handleGlobalMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // move
      moveCursor(x, y);

      // speed-based shrink
      if (prevX !== null && prevY !== null && cursorRef.current) {
        const dx = x - prevX;
        const dy = y - prevY;
        const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 60); // clamp
        const shrinkRatio = Math.min((speed / 60) * 0.4, 0.4); // max 0.4
        const scale = Math.max(0.6, 1 - shrinkRatio); // never below 0.6

        // apply scale to wrapper
        gsap.to(cursorRef.current, {
          scale,
          duration: 0.12,
          ease: 'power3.out',
        });

        // dot slightly smaller
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            scale: Math.max(0.5, scale * 0.8),
            duration: 0.12,
            ease: 'power3.out',
          });
        }

        // corners scale as well
        if (cornersRef.current) {
          Array.from(cornersRef.current).forEach((corner) => {
            gsap.to(corner, {
              scale,
              duration: 0.12,
              ease: 'power3.out',
            });
          });
        }

        // idle restore
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => {
          gsap.to(cursorRef.current, {
            scale: 1,
            duration: 0.45,
            ease: 'power3.out',
          });
          if (dotRef.current) {
            gsap.to(dotRef.current, {
              scale: 1,
              duration: 0.45,
              ease: 'power3.out',
            });
          }
          if (cornersRef.current) {
            Array.from(cornersRef.current).forEach((corner) => {
              gsap.to(corner, {
                scale: 1,
                duration: 0.45,
                ease: 'power3.out',
              });
            });
          }
        }, 200); // idle delay
      }

      prevX = x;
      prevY = y;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);

    // ---------- click feedback ----------
    const mouseDownHandler = () => {
      if (!cursorRef.current || !dotRef.current) return;
      gsap.killTweensOf([cursorRef.current, dotRef.current]);
      gsap.to(dotRef.current, { scale: 0.65, duration: 0.12, ease: 'power3.out' });
      gsap.to(cursorRef.current, { scale: 0.85, duration: 0.12, ease: 'power3.out' });
    };

    const mouseUpHandler = () => {
      if (!cursorRef.current || !dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.25, ease: 'power3.out' });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.25, ease: 'power3.out' });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    // ---------- scroll handler to detect leaving target during scroll ----------
    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;

      const mouseX = gsap.getProperty(cursorRef.current, 'x');
      const mouseY = gsap.getProperty(cursorRef.current, 'y');

      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget ||
          elementUnderMouse.closest(targetSelector) === activeTarget);

      if (!isStillOverTarget) {
        if (currentLeaveHandler) {
          currentLeaveHandler();
        }
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });

    // ---------- hover/snapping logic ----------
    const enterHandler = (e) => {
      const directTarget = e.target;

      // climb DOM to find the nearest matching targetSelector
      const allTargets = [];
      let current = directTarget;
      while (current && current !== document.body) {
        if (current.matches && current.matches(targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }

      const target = allTargets[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current) return;

      // already active
      if (activeTarget === target) return;

      // cleanup previous
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner) => {
        gsap.killTweensOf(corner);
      });

      // pause spin and reset rotation
      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      // function to update corner positions based on the target rect
      const updateCorners = (mouseX, mouseY) => {
        const rect = target.getBoundingClientRect();
        const cursorRect = cursorRef.current.getBoundingClientRect();

        const cursorCenterX = cursorRect.left + cursorRect.width / 2;
        const cursorCenterY = cursorRect.top + cursorRect.height / 2;

        const [tlc, trc, brc, blc] = Array.from(cornersRef.current);

        const { borderWidth, cornerSize, parallaxStrength } = constants;

        let tlOffset = {
          x: rect.left - cursorCenterX - borderWidth,
          y: rect.top - cursorCenterY - borderWidth,
        };
        let trOffset = {
          x: rect.right - cursorCenterX + borderWidth - cornerSize,
          y: rect.top - cursorCenterY - borderWidth,
        };
        let brOffset = {
          x: rect.right - cursorCenterX + borderWidth - cornerSize,
          y: rect.bottom - cursorCenterY + borderWidth - cornerSize,
        };
        let blOffset = {
          x: rect.left - cursorCenterX - borderWidth,
          y: rect.bottom - cursorCenterY + borderWidth - cornerSize,
        };

        if (mouseX !== undefined && mouseY !== undefined) {
          const targetCenterX = rect.left + rect.width / 2;
          const targetCenterY = rect.top + rect.height / 2;
          const mouseOffsetX = (mouseX - targetCenterX) * parallaxStrength;
          const mouseOffsetY = (mouseY - targetCenterY) * parallaxStrength;

          tlOffset.x += mouseOffsetX;
          tlOffset.y += mouseOffsetY;
          trOffset.x += mouseOffsetX;
          trOffset.y += mouseOffsetY;
          brOffset.x += mouseOffsetX;
          brOffset.y += mouseOffsetY;
          blOffset.x += mouseOffsetX;
          blOffset.y += mouseOffsetY;
        }

        const tl = gsap.timeline();
        const cornersArr = [tlc, trc, brc, blc];
        const offsets = [tlOffset, trOffset, brOffset, blOffset];

        cornersArr.forEach((corner, index) => {
          tl.to(
            corner,
            {
              x: offsets[index].x,
              y: offsets[index].y,
              duration: 0.18,
              ease: 'power2.out',
            },
            0
          );
        });
      };

      // indicate we're animating into target (prevent spamming)
      isAnimatingToTarget = true;
      updateCorners();
      setTimeout(() => {
        isAnimatingToTarget = false;
      }, 1);

      // throttle mousemove inside the element for parallax
      let moveThrottle = null;
      const targetMove = (ev) => {
        if (moveThrottle || isAnimatingToTarget) return;
        moveThrottle = requestAnimationFrame(() => {
          updateCorners(ev.clientX, ev.clientY);
          moveThrottle = null;
        });
      };

      const leaveHandler = () => {
        activeTarget = null;
        isAnimatingToTarget = false;

        // animate corners back to default positions
        if (cornersRef.current) {
          const cornersArr = Array.from(cornersRef.current);
          const { cornerSize } = constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 },
          ];

          const tl = gsap.timeline();
          cornersArr.forEach((corner, index) => {
            tl.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.28,
                ease: 'power3.out',
              },
              0
            );
          });
        }

        // resume spinning smoothly
        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current) {
            const currentRotation = gsap.getProperty(cursorRef.current, 'rotation') || 0;
            const normalizedRotation = currentRotation % 360;

            spinTl.current?.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });

            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: 'none',
              onComplete: () => {
                spinTl.current?.restart();
              },
            });
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentTargetMove = targetMove;
      currentLeaveHandler = leaveHandler;

      target.addEventListener('mousemove', targetMove);
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler, { passive: true });

    // ---------- cleanup ----------
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      clearTimeout(idleTimeout);
      clearTimeout(resumeTimeout);

      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor]);

  // keep spinDuration reactive
  useEffect(() => {
    if (!cursorRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    }
  }, [spinDuration]);

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
};

export default TargetCursor;