package PluginTest {
    action testParallelFlow {
        action startStep;
        action taskA;
        action taskB;
        action endStep;

        fork myFork;  // Fork node
        join myJoin;  // Join node

        // Successions
        first startStep then myFork;
        
        first myFork then taskA;
        first myFork then taskB;

        first taskA then myJoin;
        first taskB then myJoin;

        first myJoin then endStep;
    }
}