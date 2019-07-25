// ojr.d.ts

/**
     * The full output of a Lighthouse run.
     */
    export interface Result {
      name: "Slack",
      testSuites:SuiteResult[],
      failedTests:ItTestParams[]
    }

    // Result namespace
    // export module Result {
    //   export interface Timing {
    //     entries: Artifacts.MeasureEntry[];
    //     total: number;
    //   }
