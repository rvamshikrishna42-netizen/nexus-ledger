import React from 'react'
import CentralCore from './CentralCore'
import IdentityNode from './IdentityNode'
import AccessNode from './AccessNode'
import AssetNode from './AssetNode'
import CertificateNode from './CertificateNode'
import DeviceNode from './DeviceNode'
import AINeuralSphere from './AINeuralSphere'
import BlockchainNode from './BlockchainNode'
import AuditNode from './AuditNode'
import LuminousConduit from './LuminousConduit'
import ParticlesField from './ParticlesField'
import { useTrustCore } from '../../context/TrustCoreContext'

// Node coordinates in 3D space
const NODE_POSITIONS = {
  identity:     [-3.6, 0.8,  0],
  rbac:         [-2.4, 2.4,  0],
  assets:       [ 2.4, 2.4,  0],
  certificates: [ 3.6, 0.8,  0],
  devices:      [ 3.0, -1.8, 0],
  anomalies:    [-3.0, -1.8, 0],
  blockchain:   [ 0,   -3.2, 0],
  audit:        [ 0,    3.2, 0],
}

export default function DigitalTrustCore() {
  const { activeModule, threatLevel, particleDensity } = useTrustCore()

  const particleCount =
    particleDensity === 'high'
      ? 420
      : particleDensity === 'low'
        ? 140
        : 280

  return (
    <group>

      {/* =====================================================
          AMBIENT DIGITAL PARTICLE FIELD
      ====================================================== */}
      <ParticlesField count={particleCount} />


      {/* =====================================================
          LARGE CENTRAL NEXUS TRUST CORE
          
          This is deliberately scaled independently from
          the surrounding security nodes.
      ====================================================== */}
      <group scale={[2.6, 2.6, 2.6]}>
        <CentralCore />
      </group>


      {/* =====================================================
          SECURITY NETWORK NODES
      ====================================================== */}

     <group position={NODE_POSITIONS.identity} scale={1.35}>
  <IdentityNode />
</group>

<group position={NODE_POSITIONS.rbac} scale={1.35}>
  <AccessNode />
</group>

<group position={NODE_POSITIONS.assets} scale={1.35}>
  <AssetNode />
</group>

<group position={NODE_POSITIONS.certificates} scale={1.35}>
  <CertificateNode />
</group>

<group position={NODE_POSITIONS.devices} scale={1.35}>
  <DeviceNode />
</group>

<group position={NODE_POSITIONS.anomalies} scale={1.35}>
  <AINeuralSphere />
</group>

<group position={NODE_POSITIONS.blockchain} scale={1.35}>
  <BlockchainNode />
</group>

<group position={NODE_POSITIONS.audit} scale={1.35}>
  <AuditNode />
</group>


      {/* =====================================================
          CENTRAL CORE → SECURITY NODES
      ====================================================== */}

      <LuminousConduit
        start={[0, 0, 0]}
        end={NODE_POSITIONS.identity}
        color="#10b981"
        active={activeModule === 'identity'}
        pulseSpeed={1.4}
      />

      <LuminousConduit
        start={[0, 0, 0]}
        end={NODE_POSITIONS.rbac}
        color="#8b5cf6"
        active={activeModule === 'rbac'}
        pulseSpeed={1.3}
      />

      <LuminousConduit
        start={[0, 0, 0]}
        end={NODE_POSITIONS.assets}
        color="#00f0ff"
        active={activeModule === 'assets'}
        pulseSpeed={1.5}
      />

      <LuminousConduit
        start={[0, 0, 0]}
        end={NODE_POSITIONS.certificates}
        color="#10b981"
        active={activeModule === 'certificates'}
        pulseSpeed={1.6}
      />

      <LuminousConduit
        start={[0, 0, 0]}
        end={NODE_POSITIONS.devices}
        color="#06b6d4"
        active={activeModule === 'devices'}
        pulseSpeed={1.2}
      />

      <LuminousConduit
        start={[0, 0, 0]}
        end={NODE_POSITIONS.anomalies}
        color={
          threatLevel === 'critical'
            ? '#ef4444'
            : threatLevel === 'elevated'
              ? '#f59e0b'
              : '#0066ff'
        }
        active={
          activeModule === 'anomalies' ||
          activeModule === 'security'
        }
        pulseSpeed={
          threatLevel === 'critical'
            ? 2.8
            : 1.4
        }
      />

      <LuminousConduit
        start={[0, 0, 0]}
        end={NODE_POSITIONS.blockchain}
        color="#00f0ff"
        active={activeModule === 'blockchain'}
        pulseSpeed={1.8}
      />

      <LuminousConduit
        start={[0, 0, 0]}
        end={NODE_POSITIONS.audit}
        color="#6366f1"
        active={activeModule === 'audit'}
        pulseSpeed={1.1}
      />


      {/* =====================================================
          IDENTITY ↔ ASSET OWNERSHIP CONNECTION
      ====================================================== */}

      <LuminousConduit
        start={NODE_POSITIONS.identity}
        end={NODE_POSITIONS.assets}
        color="#00f0ff"
        active={
          activeModule === 'identity' ||
          activeModule === 'assets'
        }
        pulseSpeed={0.9}
      />


      {/* =====================================================
          BLOCKCHAIN ↔ AUDIT LEDGER
      ====================================================== */}

      <LuminousConduit
        start={NODE_POSITIONS.blockchain}
        end={NODE_POSITIONS.audit}
        color="#8b5cf6"
        active={
          activeModule === 'blockchain' ||
          activeModule === 'audit'
        }
        pulseSpeed={0.8}
      />

    </group>
  )
}