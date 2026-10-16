import { SampleLecture } from '../types/study';

export const SAMPLE_LECTURES: SampleLecture[] = [
  {
    id: 'cs-os-concurrency',
    title: 'Operating Systems: Concurrency, Deadlocks & Synchronization',
    subject: 'Computer Science & IT',
    targetExam: 'CAT (Continuous Assessment Test)',
    estimatedWords: 840,
    text: `Course: CS301 - Advanced Operating Systems
Topic: Process Concurrency, Synchronization Primitives, and Deadlock Handling

1. INTRODUCTION TO CONCURRENCY & RACE CONDITIONS
In modern multi-core computing architectures, operating systems execute multiple threads concurrently. When two or more threads access shared memory or mutable state without appropriate coordination, a Race Condition arises. A race condition occurs when the final outcome of the execution depends critically on the non-deterministic scheduling order of the CPU instructions. 

To eliminate race conditions, the code segment accessing the shared resource must be treated as a Critical Section. Any valid solution to the Critical Section problem must satisfy three mandatory criteria:
1. Mutual Exclusion: If process P is executing in its critical section, no other processes can be executing in their critical sections.
2. Progress: If no process is executing in its critical section and there exist some processes that wish to enter their critical section, only those processes not executing in their remainder sections can participate in deciding which will enter next.
3. Bounded Waiting: There must be a bound or limit on the number of times other processes are allowed to enter their critical sections after a process has made a request to enter and before that request is granted, thereby preventing starvation.

2. SYNCHRONIZATION MECHANISMS: MUTEXES VS SEMAPHORES
Software and hardware primitives enforce mutual exclusion:
A. Mutex Locks (Mutual Exclusion Locks):
A Mutex is a binary synchronization flag that provides two atomic operations: acquire() and release(). An acquire() call locks the mutex, and release() unlocks it. Mutexes have ownership: only the thread that acquired the lock is permitted to release it. Spinlocks are mutexes that loop continuously while waiting for the lock to become available; while fast for brief lock intervals, they waste CPU clock cycles on uniprocessors through busy waiting.

B. Semaphores (Dijkstra, 1965):
A Semaphore S is an integer variable accessed only through two standard atomic operations: wait() (originally P for proberen, "to test") and signal() (originally V for verhogen, "to increment").
- Counting Semaphore: The value of S can range over an unrestricted integer domain, controlling access to a resource consisting of a finite number of instances.
- Binary Semaphore: The value of S can range only between 0 and 1, functionally similar to a mutex lock without strict ownership semantics.
Wait operation definition:
wait(S) {
    while (S <= 0); // busy wait or block
    S--;
}
Signal operation definition:
signal(S) {
    S++;
}

3. DEADLOCK THEORY & COFFMAN CONDITIONS
A Deadlock is a state in which each process in a set is waiting for an event that only another process in the same set can cause. In operating systems, deadlocks typically occur over resource allocation.

Edward G. Coffman Jr. formalized that a deadlock can arise if and only if all four of the following conditions hold simultaneously:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode (only one process at a time can use the resource).
2. Hold and Wait: A process must be concurrently holding at least one resource and requesting additional resources that are currently being held by other processes.
3. No Preemption: Resources cannot be forcibly preempted from a process; a resource can only be released voluntarily by the process holding it after that process has completed its task.
4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain (e.g., P0 waits for a resource held by P1, P1 waits for P2, and Pn waits for P0).

4. DEADLOCK PREVENTION & AVOIDANCE
To prevent deadlocks, the OS must invalidate at least one of the four Coffman conditions:
- Eliminating Circular Wait: Impose a strict total ordering of all resource types and require that each process requests resources only in an increasing order of enumeration.
- Deadlock Avoidance: Requires the system to have prior information concerning which resources a process will request during its lifetime. Dijkstra's Banker's Algorithm evaluates resource requests to guarantee that the system remains in a Safe State (a state where there exists a safe execution sequence such that every process can finish).

COMMON CAT EXAM QUESTIONS:
- Differentiate between a Counting Semaphore and a Binary Semaphore.
- State and explain the four Coffman conditions for deadlocks.
- Why does busy waiting degrade throughput on single-core architectures, and how do blocking semaphores resolve this?`,
  },
  {
    id: 'bio-cellular-respiration',
    title: 'Cellular Respiration, ATP Synthesis & The Krebs Cycle',
    subject: 'Medicine & Life Sciences',
    targetExam: 'Final Examination',
    estimatedWords: 760,
    text: `Course: BIO201 - Biochemistry & Cellular Physiology
Topic: Cellular Respiration, Glycolysis, Citric Acid Cycle, and Oxidative Phosphorylation

1. OVERVIEW OF AEROBIC CELLULAR RESPIRATION
Cellular respiration is the biochemical pathway by which living cells catabolize glucose and other fuel molecules to harvest metabolic energy in the form of Adenosine Triphosphate (ATP). The overall net chemical equation for aerobic respiration of glucose is:
C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O + ~30-32 ATP + heat.
The process is categorized into four primary biochemical stages:
1. Glycolysis (cytosol)
2. Pyruvate Oxidation / Link Reaction (mitochondrial matrix)
3. The Citric Acid Cycle (Krebs cycle, mitochondrial matrix)
4. Oxidative Phosphorylation (inner mitochondrial membrane)

2. GLYCOLYSIS
Glycolysis is an anaerobic sequence of 10 enzyme-catalyzed reactions that splits one 6-carbon glucose molecule into two 3-carbon pyruvate molecules.
- Energy Investment Phase: Consumes 2 molecules of ATP. The rate-limiting enzyme is Phosphofructokinase-1 (PFK-1), which phosphorylates fructose-6-phosphate to fructose-1,6-bisphosphate. PFK-1 is allosterically inhibited by high ATP and high citrate, and activated by AMP.
- Energy Payoff Phase: Produces 4 ATP molecules via substrate-level phosphorylation and 2 NADH molecules.
- Net Yield of Glycolysis: 2 Pyruvate, 2 net ATP, and 2 NADH per glucose.

3. PYRUVATE OXIDATION (THE LINK REACTION)
Under aerobic conditions, pyruvate enters the mitochondrial matrix via pyruvate translocase. The multi-enzyme complex Pyruvate Dehydrogenase (PDH) performs oxidative decarboxylation:
Pyruvate + CoA + NAD+ -> Acetyl-CoA + CO2 + NADH + H+.
This reaction is irreversible and serves as the crucial bridge connecting carbohydrate metabolism to the Citric Acid Cycle.

4. THE CITRIC ACID CYCLE (KREBS CYCLE)
Acetyl-CoA (2 carbons) condenses with Oxaloacetate (4 carbons) to form Citrate (6 carbons), catalyzed by Citrate Synthase. Throughout one complete turn of the cycle:
- 2 molecules of CO2 are released.
- 3 molecules of NAD+ are reduced to NADH + H+.
- 1 molecule of FAD is reduced to FADH2.
- 1 molecule of GTP (or ATP) is synthesized via substrate-level phosphorylation (catalyzed by succinyl-CoA synthetase).
Because each glucose yields two pyruvates, the cycle turns twice per original glucose molecule, yielding 6 NADH, 2 FADH2, 2 GTP/ATP, and 4 CO2.

5. OXIDATIVE PHOSPHORYLATION & THE CHEMIOSMOTIC HYPOTHESIS
Peter Mitchell's Chemiosmotic Hypothesis explains how electron transport is coupled to ATP synthesis:
A. Electron Transport Chain (ETC):
NADH donates electrons to Complex I (NADH:ubiquinone oxidoreductase), while FADH2 donates electrons to Complex II (Succinate dehydrogenase). As electrons traverse Complexes I, III (cytochrome bc1 complex), and IV (cytochrome c oxidase) to the terminal electron acceptor Oxygen (forming H2O), protons (H+) are pumped across the inner mitochondrial membrane into the intermembrane space. This creates an electrochemical proton gradient (Proton-Motive Force, PMF).
B. ATP Synthase (Complex V):
Protons flow down their concentration gradient back into the mitochondrial matrix through the Fo rotor subunit of ATP Synthase. This mechanical rotation drives the catalytic conformational changes in the F1 subunit that condense ADP and inorganic phosphate (Pi) into ATP.

EXAM TRAPS & CAT FOCUS:
- Complex II does NOT pump protons; therefore, FADH2 yields fewer ATPs (~1.5 ATP) than NADH (~2.5 ATP).
- Cyanide and Carbon Monoxide inhibit Complex IV, completely halting electron flow and ATP production.
- Oligomycin directly inhibits ATP synthase, while 2,4-Dinitrophenol (DNP) acts as an uncoupler that dissipates the proton gradient as heat.`,
  },
  {
    id: 'econ-macro-inflation',
    title: 'Macroeconomic Equilibrium, Inflation Dynamics & Monetary Policy',
    subject: 'Economics & Business',
    targetExam: 'Midterm Exam',
    estimatedWords: 720,
    text: `Course: ECON202 - Intermediate Macroeconomics
Topic: Aggregate Demand / Aggregate Supply (AD-AS) Framework, Phillips Curve, and Central Bank Policy

1. THE AGGREGATE DEMAND-AGGREGATE SUPPLY FRAMEWORK
The AD-AS model describes price level and real output (Real GDP) determination:
- Aggregate Demand (AD): Represents total planned expenditure across an economy: AD = C + I + G + (X - M). AD slopes downward due to the Wealth Effect (Pigou), Interest Rate Effect (Keynes), and Exchange Rate Effect (Mundell-Fleming).
- Short-Run Aggregate Supply (SRAS): Slopes upward due to sticky wages and sticky prices in the short term.
- Long-Run Aggregate Supply (LRAS): A vertical line situated at Potential Output (Natural Rate of Output, Y*). In the long run, wages and input prices are fully flexible, meaning output is determined solely by capital, labor, technology, and total factor productivity, not by nominal price levels.

2. INFLATION TYPOLOGIES
Inflation is defined as a sustained, general increase in the price level of goods and services over time:
A. Demand-Pull Inflation: Occurs when Aggregate Demand expands rapidly beyond the productive capacity of the economy ("too much money chasing too few goods"). Examples include fiscal stimulus or excess money supply.
B. Cost-Push Inflation: Occurs when supply-side shocks increase production costs (e.g., global oil price spikes). This shifts the SRAS curve leftward, leading to Stagflation (falling real GDP combined with rising inflation and higher unemployment).

3. THE PHILLIPS CURVE & INFLATION EXPECTATIONS
- Short-Run Phillips Curve (SRPC): Suggests an inverse empirical relationship between inflation and unemployment. When unemployment is low, wage pressures drive up inflation.
- Long-Run Phillips Curve (LRPC): Milton Friedman and Edmund Phelps demonstrated that the trade-off disappears in the long run. The LRPC is vertical at the Non-Accelerating Inflation Rate of Unemployment (NAIRU) or Natural Rate of Unemployment. Attempts to permanently push unemployment below NAIRU via expansionary policy merely create accelerating inflation.

4. CENTRAL BANK MONETARY POLICY TOOLS
Central banks control the nominal short-term interest rate and credit conditions through three primary tools:
1. Open Market Operations (OMO): Purchasing or selling government securities to inject or absorb liquidity.
2. Reserve Requirement Ratio: The statutory percentage of deposits commercial banks must keep in vault cash or at the central bank.
3. Policy / Discount Rate: The rate at which the central bank lends overnight funds to commercial banks.
- The Taylor Rule: Recommends how the central bank should adjust the nominal interest rate based on discrepancies between actual inflation and target inflation, and actual GDP and potential GDP.`,
  },
];

export const DEFAULT_INITIAL_SESSION = {
  title: 'Operating Systems: Concurrency, Deadlocks & Synchronization',
  subject: 'Computer Science & IT' as const,
  targetExam: 'CAT (Continuous Assessment Test)' as const,
  overviewSummary:
    'This lecture provides an academic breakdown of concurrent process coordination and mutual exclusion in modern multi-core operating systems. It formally examines race conditions, critical section constraints, and the synchronization primitives designed to eliminate them, including Mutex locks and Dijkstra semaphores.\n\nThe curriculum further establishes deadlock theory via the four Coffman conditions (Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait) and examines avoidance strategies such as the Banker\'s Algorithm and resource hierarchy ordering.',
  bulletSummary: [
    'A Race Condition occurs when concurrent thread access produces non-deterministic output depending on instruction timing.',
    'Valid Critical Section algorithms must strictly fulfill Mutual Exclusion, Progress, and Bounded Waiting.',
    'Mutexes enforce lock ownership where only the acquiring thread can release the lock; Semaphores permit multi-thread signaling.',
    'Deadlocks arise if and only if all four Coffman conditions hold simultaneously.',
    'Circular wait can be completely eliminated by imposing a strict global ordering on all resource acquisitions.',
  ],
  concepts: [
    {
      id: 'c-1',
      title: 'The Critical Section Problem',
      explanation:
        'A designated segment of code accessing shared mutable resources. Any valid solution must prevent simultaneous execution while guaranteeing that waiting threads eventually enter.',
      highYieldPoints: [
        'Mutual exclusion guarantees single-thread residency.',
        'Progress ensures decisions are made only by active contenders.',
        'Bounded waiting prevents indefinite starvation.',
      ],
      formulaOrRule: 'Invariant: ∀ t, |{P_i | P_i in Critical Section}| <= 1',
    },
    {
      id: 'c-2',
      title: 'Coffman Deadlock Axioms & Banker\'s Algorithm',
      explanation:
        'Deadlocks require simultaneous satisfaction of Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Systems preserve a Safe State using matrix resource checks.',
      highYieldPoints: [
        'Breaking any single Coffman condition prevents deadlocks.',
        'Total resource enumeration breaks Circular Wait.',
      ],
      formulaOrRule: 'Safe State Invariant: Need[i] <= Work implies process P_i can safely finish.',
    },
  ],
  definitions: [
    {
      id: 'def-1',
      term: 'Race Condition',
      definition:
        'A flaw where the output of concurrent processes depends on the arbitrary execution order or timing of CPU threads.',
      importance: 'critical' as const,
      examContext: 'Fundamental question in Section A of CAT examinations.',
    },
    {
      id: 'def-2',
      term: 'Mutual Exclusion',
      definition:
        'A concurrency control requirement ensuring no two processes access a shared resource or critical section at the same instant.',
      importance: 'critical' as const,
      examContext: 'Core marking scheme requirement for synchronization essays.',
    },
    {
      id: 'def-3',
      term: 'Counting Semaphore',
      definition:
        'A synchronization variable with an unrestricted integer range, managed atomically via wait() and signal() operations.',
      importance: 'high' as const,
      examContext: 'Frequently contrasted with binary semaphores and mutex locks.',
    },
    {
      id: 'def-4',
      term: 'Circular Wait',
      definition:
        'A closed dependency chain where P0 awaits a resource held by P1, and Pn awaits a resource held by P0.',
      importance: 'critical' as const,
      examContext: 'Exam questions often ask how resource hierarchy eliminates this condition.',
    },
  ],
  flashcards: [
    {
      id: 'fc-1',
      front: 'What are the three mandatory requirements for solving the Critical Section problem?',
      back: '1. Mutual Exclusion (only one process in CS)\n2. Progress (no indefinite postponement)\n3. Bounded Waiting (finite limit before entry to prevent starvation).',
      topic: 'Concurrency Fundamentals',
      difficulty: 'medium' as const,
      hint: 'Think about exclusion, advancement, and fairness bounds.',
      examTip: 'Examiners expect all 3 stated explicitly with definitions to award full points.',
      box: 2,
      intervalDays: 3,
      masteryStatus: 'review' as const,
      timesReviewed: 1,
    },
    {
      id: 'fc-2',
      front: 'What is the key technical difference between a Mutex Lock and a Binary Semaphore?',
      back: 'A Mutex enforces strict ownership (only the acquiring thread can release it). A Binary Semaphore has no ownership and can be signaled/unlocked by any thread.',
      topic: 'Synchronization Primitives',
      difficulty: 'hard' as const,
      hint: 'Focus on thread ownership and signaling capability.',
      examTip: 'High-frequency exam trap! Never say they are 100% identical.',
      box: 3,
      intervalDays: 7,
      masteryStatus: 'review' as const,
      timesReviewed: 2,
    },
    {
      id: 'fc-3',
      front: 'List the four Coffman conditions required for a system deadlock to persist.',
      back: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait (All 4 must hold simultaneously).',
      topic: 'Deadlock Theory',
      difficulty: 'medium' as const,
      hint: 'Remember the acronym MHNC or the four resource states.',
      examTip: 'Stating that any single condition causes deadlock is an automatic point deduction.',
      box: 4,
      intervalDays: 14,
      masteryStatus: 'mastered' as const,
      timesReviewed: 3,
    },
    {
      id: 'fc-4',
      front: 'How does imposing a total ordering on resources prevent deadlocks?',
      back: 'It eliminates the Circular Wait condition by requiring processes to request resources strictly in ascending numerical order, making circular dependency cycles mathematically impossible.',
      topic: 'Deadlock Prevention',
      difficulty: 'hard' as const,
      hint: 'Think about resource indexing: R1, R2, R3...',
      examTip: 'Quoted in university CAT question 4(b). Mention Havender\'s ordering scheme.',
      box: 2,
      intervalDays: 3,
      masteryStatus: 'review' as const,
      timesReviewed: 1,
    },
    {
      id: 'fc-5',
      front: 'What is busy waiting (spinlock), and why is it problematic on single-core CPUs?',
      back: 'Busy waiting continuously executes loop checks consuming CPU clock cycles while waiting. On uniprocessors, it wastes 100% CPU cycles that could otherwise run the lock-holding thread.',
      topic: 'Synchronization Primitives',
      difficulty: 'medium' as const,
      hint: 'Think about CPU utilization without thread preemption.',
      examTip: 'Contrast with blocking semaphores which place the thread in a sleep queue.',
      box: 4,
      intervalDays: 14,
      masteryStatus: 'mastered' as const,
      timesReviewed: 4,
    },
    {
      id: 'fc-6',
      front: 'Define a Safe State in the context of Dijkstra\'s Banker\'s Algorithm.',
      back: 'A state where there exists at least one safe execution sequence <P1, P2, ... Pn> such that every process can satisfy its maximum resource claims and terminate.',
      topic: 'Deadlock Avoidance',
      difficulty: 'hard' as const,
      hint: 'Does a safe state guarantee no deadlock, or just the existence of a sequence?',
      examTip: 'Unsafe state does NOT mean deadlock has occurred; it means deadlock cannot be guaranteed avoidable.',
      box: 1,
      intervalDays: 1,
      masteryStatus: 'learning' as const,
      timesReviewed: 0,
    },
    {
      id: 'fc-7',
      front: 'What is priority inversion, and how does priority inheritance resolve it?',
      back: 'Priority inversion occurs when a low-priority thread holds a lock needed by a high-priority thread, and a medium-priority thread preempts the low-priority thread. Priority inheritance temporarily elevates the low-priority thread\'s priority to match the waiting high-priority thread.',
      topic: 'Real-Time Synchronization',
      difficulty: 'hard' as const,
      hint: 'Mars Pathfinder spacecraft rover bug!',
      examTip: 'Famous case study question in Operating Systems final exams.',
      box: 2,
      intervalDays: 3,
      masteryStatus: 'review' as const,
      timesReviewed: 1,
    },
    {
      id: 'fc-8',
      front: 'What is the operational difference between wait() and signal() on semaphores?',
      back: 'wait(S) decrements the semaphore counter and blocks if S <= 0. signal(S) increments the counter and unblocks one waiting thread from the queue.',
      topic: 'Concurrency Fundamentals',
      difficulty: 'easy' as const,
      hint: 'Originally P() and V() in Dijkstra\'s Dutch terminology.',
      examTip: 'Must mention atomicity and queue unblocking.',
      box: 5,
      intervalDays: 30,
      masteryStatus: 'mastered' as const,
      timesReviewed: 5,
    },
  ],
  examAlerts: [
    {
      id: 'ea-1',
      title: 'Confusing Mutex Locks with Binary Semaphores',
      trapDescription:
        'Students often claim Mutex and Binary Semaphore are identical since both restrict access to 1 thread.',
      howToAvoid:
        'Explicitly state that Mutexes enforce strict thread ownership (only locker can unlock), whereas Semaphores allow inter-thread signaling without ownership.',
    },
    {
      id: 'ea-2',
      title: 'Claiming Unsafe State equals Deadlock',
      trapDescription:
        'Assuming that entering an Unsafe State under Banker\'s Algorithm guarantees deadlock.',
      howToAvoid:
        'State clearly that an Unsafe State means the OS can no longer guarantee deadlock freedom if all processes request their maximum claims simultaneously, but deadlock may not actually materialize.',
    },
  ],
  metrics: {
    originalWordCount: 840,
    summaryWordCount: 201,
    compressionRatioPercent: 76,
    estimatedOriginalReadTimeMin: 3.7,
    estimatedSummaryReadTimeMin: 0.9,
    timeSavedMin: 42,
    processingLatencyMs: 120,
    aiModelUsed: 'Gemini 3.8 Flash',
    keyTermsExtractedCount: 4,
    flashcardsGeneratedCount: 8,
    accuracyScore: 94,
  },
  createdAt: new Date().toISOString(),
};

