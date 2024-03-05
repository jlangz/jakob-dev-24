"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";


export default function Shapes() {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    setMaterials(new Array(5).fill(null).map(() => getRandomMaterial()));
  }, []);

  const [allMatched, setAllMatch] = useState(false);
  const [firstColorHex, setFirstColorHex] = useState("#ffffff");


  const handleMaterialChange = useCallback((index) => {
    const newMaterials = [...materials];
    newMaterials[index] = getRandomMaterial();
    setMaterials(newMaterials);
  
    const newFirstColorHex = `#${newMaterials[0].color.getHexString()}`;
    setFirstColorHex(newFirstColorHex);
  
    const allMatched = newMaterials.every(material => material.color.getHex() === newMaterials[0].color.getHex());
    setAllMatch(allMatched);
  }, [materials]);
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md-col-start-2 md:mt-0">
      <Canvas className="z-0" shadows gl={{antialias:false}} dpr={[1, 1.5]} camera={{position: [0,0,25], fov:30, near:1, far:40}}>
        <Suspense fallback={null}>
          <Geometries materials={materials} onMaterialChange={handleMaterialChange} />
          <ContactShadows
          position={[0, -3.5, 0]}
          opacity={0.65}
          scale={40}
          blur={1}
          far={9}/>
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      <div className={`text-center match-text ${allMatched ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text" style={{ color:firstColorHex }}>Gotta match&apos;em all!</span>
      </div>

    </div>
  )
}

function getRandomMaterial() {
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x3c40c6, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0xffa801, roughness: 0.05 }),
    new THREE.MeshStandardMaterial({ color: 0xff3f34, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.2, metalness: 0.8 }),
  ];
  return gsap.utils.random(materials); // Adjusted to use basic random selection
}

function Geometries({ materials, onMaterialChange }) {
  const geometries = [
    {
      position: [0,0,0],
      r: 0.2,
      geometry: new THREE.IcosahedronGeometry(3), // d20
    },
    {
      position: [1,-0.75,4],
      r: 0.6,
      geometry: new THREE.CapsuleGeometry(0.5, 1.6, 2, 16), // pill
    },
    {
      position: [-1.8,1.8,-2],
      r: 0.5,
      geometry: new THREE.TorusGeometry(1.5, 0.4, 12, 80), // Donut
    },
    {
      position: [-1.5,-1,3],
      r: 0.9,
      geometry: new THREE.OctahedronGeometry(1, 0), // d8
    },
    {
      position: [2,1.5,-2],
      r: 0.6,
      geometry: new THREE.ConeGeometry(1.5, 4.5, 12, 10), // Cone
    },
  ];
  const soundEffects = [
    new Audio("/sounds/knock1.ogg"),
    new Audio("/sounds/knock2.ogg"),
    new Audio("/sounds/knock3.ogg"),
    new Audio("/sounds/knock4.ogg"),
  ]
  return geometries.map(({ position, r, geometry }, index) => (
    <Geometry
      key={index} // Simplified key for demo purposes
      position={position.map(p => p * 2)}
      r={r}
      geometry={geometry}
      soundEffects={soundEffects}
      material={materials[index]}
      onMaterialChange={() => onMaterialChange(index)}
    />
  ));
}

function Geometry({ r, position, geometry, material, onMaterialChange, soundEffects }){
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);

  function handleClick(e){
    const mesh = e.object;
    gsap.utils.random(soundEffects).play();
    gsap.to(mesh.rotation,{
      x: `+=${gsap.utils.random(0.1,2)}`,
      y: `+=${gsap.utils.random(0.1,2)}`,
      z: `+=${gsap.utils.random(0.1,2)}`,
      duration: 1,
      ease: "elastic.out(1,0.3)",
      yoyo: true,
    });
    onMaterialChange();
  }

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  }
  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  }

  useEffect(() => {
    let ctx = gsap.context(() => {
      setVisible(true);
      gsap.from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: gsap.utils.random(0.8, 1.2),
        ease: "elastic.out(1,0.3)",
        delay: gsap.utils.random(0, 0.5),
      });
    })
    return () => {
      ctx.revert(); //cleanup
    }
  }, [])

  return (
    <group position={position} ref= {meshRef}>
      <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={3 * r}>
        <mesh
          geometry={geometry}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          visible={visible}
          material={material}
        />
      </Float>
    </group>
  )

}