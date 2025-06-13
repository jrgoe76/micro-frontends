/**
 * Utility functions to test Keycloak connectivity and CORS configuration
 */

export const testKeycloakConnectivity = async (keycloakUrl: string, realm: string): Promise<{
  isReachable: boolean;
  corsConfigured: boolean;
  error?: string;
}> => {
  try {
    // Test basic connectivity to Keycloak
    const realmUrl = `${keycloakUrl}/realms/${realm}`;
    
    console.log('🧪 Testing Keycloak connectivity to:', realmUrl);
    
    const response = await fetch(realmUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      console.log('✅ Keycloak realm is reachable and CORS is configured correctly');
      return {
        isReachable: true,
        corsConfigured: true
      };
    } else {
      console.log('⚠️ Keycloak realm responded with status:', response.status);
      return {
        isReachable: true,
        corsConfigured: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('❌ Keycloak connectivity test failed:', error);
    
    if (error instanceof TypeError && error.message.includes('CORS')) {
      return {
        isReachable: true,
        corsConfigured: false,
        error: 'CORS policy blocks the request. Please configure Keycloak client Web Origins.'
      };
    }
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        isReachable: false,
        corsConfigured: false,
        error: 'Cannot reach Keycloak server. Please ensure it is running.'
      };
    }
    
    return {
      isReachable: false,
      corsConfigured: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const logKeycloakDiagnostics = (keycloakUrl: string, realm: string, clientId: string) => {
  console.group('🔐 Keycloak Configuration Diagnostics');
  console.log('Keycloak URL:', keycloakUrl);
  console.log('Realm:', realm);
  console.log('Client ID:', clientId);
  console.log('Application Origin:', window.location.origin);
  console.log('Expected Web Origins in Keycloak:', window.location.origin);
  console.log('Expected Redirect URIs:', `${window.location.origin}/*`);
  console.groupEnd();
};
