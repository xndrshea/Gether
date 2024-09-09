import React, { useMemo } from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function RetroGrid({
  className,
  angle = 70,
  blueTileProbability = 0.005, // 0.5% chance for a blue tile
}) {
  const blueTiles = useMemo(() => {
    const tiles = [];
    const rows = 50;
    const cols = 100;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (Math.random() < blueTileProbability) {
          tiles.push({ x: j, y: i });
        }
      }
    }
    return tiles;
  }, [blueTileProbability]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden opacity-100 [perspective:200px]",
        className,
      )}
      style={{ "--grid-angle": `${angle}deg` }}
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid",
            "[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw]",
            "[background-image:linear-gradient(to_right,rgba(0,0,0,0.6)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.6)_1px,transparent_0)]",
            "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.6)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.6)_1px,transparent_0)]",
          )}
        >
          {/* Blue Tiles */}
          {blueTiles.map((tile, index) => (
            <div
              key={`${index}-${tile.x}-${tile.y}`}
              className="absolute bg-blue-600 opacity-100 animate-fade-in-out"
              style={{
                width: '60px',
                height: '60px',
                left: `${tile.x * 60}px`,
                top: `${tile.y * 60}px`,
                animationDelay: `${Math.random() * 20}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  );
}