import { useMemo } from "react";
import * as THREE from "three";
import { CORE_PARAMETERS } from "../../config";

export function useCoreGeometry() {
  const innerCoreGeo = useMemo(() => {
    return new THREE.IcosahedronGeometry(CORE_PARAMETERS.radius * 0.95, CORE_PARAMETERS.detail);
  }, []);

  const outerShellGeo = useMemo(() => {
    return new THREE.IcosahedronGeometry(CORE_PARAMETERS.radius, CORE_PARAMETERS.detail);
  }, []);

  const edgesGeo = useMemo(() => {
    return new THREE.EdgesGeometry(outerShellGeo);
  }, [outerShellGeo]);

  return { innerCoreGeo, edgesGeo };
}
