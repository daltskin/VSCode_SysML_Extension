package SystemAssembly {

  import StandardViewDefinitions::*;

  part def ComponentA {
    out port pOut;
  }

  part def ComponentB {
    in port pIn;
  }

  part def MySystemArchitecture {
    part a : ComponentA;
    part b : ComponentB;

    connection dataFlow connect a.pOut to b.pIn;
  }

  part def AnotherSubsystem {
    part x : ComponentA;
  }

  // View scoped to only MySystemArchitecture with container
  view 'Architecture framed' : InterconnectionView {
    expose MySystemArchitecture;
  }

  // View scoped to MySystemArchitecture children promoted to top-level 
  view 'Architecture noframe' : InterconnectionView {
    expose MySystemArchitecture::*;
  }
  
    // View scoped to only ComponentA
  view 'Component A detail' : GeneralView {
    expose ComponentA;
  }

  // View scoped to everything under SystemAssembly
  view 'Full System' : GeneralView {
    expose SystemAssembly::**;
  }
}
