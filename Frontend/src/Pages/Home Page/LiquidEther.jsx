import { useState } from 'react';
import LiquidEther from './LiquidEther';

const colorCombinations = [
  {
    name: 'Aurora Dreams',
    colors: ['#00FFA3', '#03E1FF', '#DC1FFF'],
    description: 'Vibrant cyan-to-pink aurora'
  },
  {
    name: 'Sunset Blaze',
    colors: ['#FF6B35', '#F7931E', '#FBB040'],
    description: 'Warm orange sunset glow'
  },
  {
    name: 'Ocean Depths',
    colors: ['#0066FF', '#00D4FF', '#7B2EFF'],
    description: 'Deep ocean blues'
  },
  {
    name: 'Neon Tokyo',
    colors: ['#FF2E63', '#08D9D6', '#FF9A00'],
    description: 'Cyberpunk neon lights'
  },
  {
    name: 'Purple Haze',
    colors: ['#5227FF', '#FF9FFC', '#B19EEF'],
    description: 'Original purple gradient'
  },
  {
    name: 'Mint Frost',
    colors: ['#00FFC6', '#00E5FF', '#B4FFE4'],
    description: 'Cool mint and aqua'
  },
  {
    name: 'Rose Gold',
    colors: ['#FFD700', '#FF69B4', '#FF1493'],
    description: 'Elegant rose gold shimmer'
  },
  {
    name: 'Electric Storm',
    colors: ['#7F00FF', '#E100FF', '#00FFFF'],
    description: 'Electric purple to cyan'
  },
  {
    name: 'Fire & Ice',
    colors: ['#FF3C00', '#FF8C00', '#00E5FF'],
    description: 'Hot orange meets cool cyan'
  },
  {
    name: 'Cosmic Nebula',
    colors: ['#9D00FF', '#FF006E', '#00F5FF'],
    description: 'Deep space colors'
  },
  {
    name: 'Lime Energy',
    colors: ['#39FF14', '#00FF87', '#CCFF00'],
    description: 'Bright lime greens'
  },
  {
    name: 'Royal Velvet',
    colors: ['#4B0082', '#8A2BE2', '#DA70D6'],
    description: 'Deep royal purples'
  }
];

export default function LiquidColorCombos() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
          Liquid Ether Color Palettes
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Click on any palette to see it in action
        </p>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {colorCombinations.map((combo, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`relative p-4 rounded-xl transition-all duration-300 ${
                selected === index
                  ? 'ring-4 ring-white scale-105'
                  : 'ring-2 ring-gray-700 hover:ring-gray-500'
              }`}
            >
              <div className="flex gap-1 mb-3 h-20 rounded-lg overflow-hidden">
                {combo.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <h3 className="font-bold text-lg mb-1">{combo.name}</h3>
              <p className="text-sm text-gray-400">{combo.description}</p>
              {selected === index && (
                <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded text-xs font-bold">
                  ACTIVE
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Live Preview */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {colorCombinations[selected].name}
            </h2>
            <div className="flex gap-2">
              {colorCombinations[selected].colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-400 mt-1 block font-mono">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-black rounded-xl overflow-hidden" style={{ height: '500px' }}>
            <LiquidEther
              colors={colorCombinations[selected].colors}
              mouseForce={35}
              cursorSize={150}
              resolution={0.75}
              dt={0.016}
              iterationsPoisson={40}
              autoDemo={true}
              autoSpeed={0.5}
              autoIntensity={2.2}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          
          <p className="text-gray-400 text-center mt-4">
            Move your mouse over the canvas to interact with the fluid simulation
          </p>
        </div>

        {/* Usage Code */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-3">Usage</h3>
          <pre className="bg-black rounded-lg p-4 overflow-x-auto text-sm">
            <code className="text-green-400">
{`<LiquidEther
  colors={['${colorCombinations[selected].colors[0]}', '${colorCombinations[selected].colors[1]}', '${colorCombinations[selected].colors[2]}']}
  mouseForce={35}
  cursorSize={150}
  resolution={0.75}
/>`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}