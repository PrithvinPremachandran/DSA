/* ============================================================
   ALGOFORGE — content data
   All course content, quiz banks, interview questions and
   practice problems live here as plain data so the rest of the
   app can render them generically.
   ============================================================ */

const COURSE_DATA = {
  modules: [
    {
      id: "arrays",
      num: 1,
      title: "Arrays & Strings",
      tagline: "Contiguous memory, indexing, and the two-pointer / sliding-window toolkit.",
      runway: 1,
      tiers: {
        beginner: `
          <div class="lesson-block">
            <h3>What an array actually is</h3>
            <p>An array is a block of memory slots sitting next to each other, each holding one value, numbered starting at 0. Because the slots are contiguous, the computer can jump straight to slot <code>i</code> using simple arithmetic &mdash; that's why <code>arr[i]</code> is O(1). Think of it like a row of numbered lockers: if you know the locker number, you walk straight to it. No searching required.</p>
            <div class="callout"><b>Real-world analogy:</b> A parking garage with numbered spots. Finding car #42 is instant if you know the number. But if a car leaves from the middle, everyone behind it doesn't shift &mdash; unlike an array, where removing an element means shifting every element after it one spot to the left.</div>
            <h3>Strings are arrays of characters</h3>
            <p>In most languages a string behaves like a read-only array of characters. Once you see it that way, every array trick (indexing, slicing, iterating, two pointers) applies directly to strings too.</p>
            <pre class="code-block"><span class="kw">let</span> fruits = [<span class="str">"apple"</span>, <span class="str">"banana"</span>, <span class="str">"cherry"</span>];
console.log(fruits[1]); <span class="cm">// "banana" -- O(1) access</span>

<span class="kw">let</span> name = <span class="str">"claude"</span>;
console.log(name[0]);   <span class="cm">// "c" -- strings index just like arrays</span></pre>
            <h3>The core operations and their real cost</h3>
            <table class="complexity-table">
              <tr><th>Operation</th><th>Time</th><th>Why</th></tr>
              <tr><td class="op">Read by index</td><td class="op">O(1)</td><td>Direct address math</td></tr>
              <tr><td class="op">Search (unsorted)</td><td class="op">O(n)</td><td>Must check each slot</td></tr>
              <tr><td class="op">Insert / delete at end</td><td class="op">O(1)*</td><td>No shifting needed</td></tr>
              <tr><td class="op">Insert / delete at start/middle</td><td class="op">O(n)</td><td>Everything after must shift</td></tr>
            </table>
            <p class="small-muted">*Amortized, assuming the underlying array has spare capacity (this is how dynamic arrays like JS <code>Array</code> or Python <code>list</code> work).</p>
          </div>`,
        intermediate: `
          <div class="lesson-block">
            <h3>Real-world example: detecting duplicate transactions</h3>
            <p>A payments system receives a stream of transaction IDs and needs to flag duplicates in real time &mdash; a classic "have I seen this before" problem. The naive approach re-scans the whole array for every new item (O(n) each time, O(n&sup2;) overall). The fix is to trade memory for speed using an auxiliary set, but before reaching for a hash set, it's worth understanding the <b>two-pointer</b> pattern, which solves a huge class of array problems in-place with O(1) extra space.</p>
            <h3>Two pointers: shrinking a search space</h3>
            <p>Instead of comparing every pair (O(n&sup2;)), keep one pointer at each end of a <i>sorted</i> array and move them toward each other based on a comparison. This works because sorting gives you a monotonic property you can exploit.</p>
            <pre class="code-block"><span class="cm">// Given a SORTED array, find two numbers that add up to target</span>
<span class="kw">function</span> <span class="fn">twoSumSorted</span>(nums, target) {
  <span class="kw">let</span> left = 0, right = nums.length - 1;
  <span class="kw">while</span> (left < right) {
    <span class="kw">const</span> sum = nums[left] + nums[right];
    <span class="kw">if</span> (sum === target) <span class="kw">return</span> [left, right];
    <span class="kw">if</span> (sum < target) left++;      <span class="cm">// need a bigger sum</span>
    <span class="kw">else</span> right--;                  <span class="cm">// need a smaller sum</span>
  }
  <span class="kw">return</span> [-1, -1];
}</pre>
            <p>This runs in O(n) time and O(1) space &mdash; a direct upgrade over the brute-force O(n&sup2;) pair check, and it's the same pattern used to reverse a string in place, detect palindromes, or partition an array (Dutch national flag problem).</p>
            <h3>Sliding window: the "moving subarray" pattern</h3>
            <p>Used constantly in real systems: rate limiters (requests in the last 60 seconds), analytics dashboards (rolling averages), and text processing (longest substring without repeats). Instead of recomputing a subarray sum from scratch every time the window moves, you subtract the element leaving and add the element entering.</p>
            <pre class="code-block"><span class="cm">// Max sum of any contiguous subarray of size k</span>
<span class="kw">function</span> <span class="fn">maxSumWindow</span>(nums, k) {
  <span class="kw">let</span> windowSum = 0;
  <span class="kw">for</span> (<span class="kw">let</span> i = 0; i < k; i++) windowSum += nums[i];
  <span class="kw">let</span> best = windowSum;
  <span class="kw">for</span> (<span class="kw">let</span> i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k]; <span class="cm">// slide: add new, drop old</span>
    best = Math.max(best, windowSum);
  }
  <span class="kw">return</span> best;
}</pre>
          </div>`,
        expert: `
          <div class="lesson-block">
            <h3>What interviewers are actually testing</h3>
            <p>At the expert level, array questions stop being about "can you write a loop" and start testing whether you can (1) spot the O(n&sup2;) brute force instantly, (2) identify which pattern collapses it &mdash; two pointers, sliding window, prefix sums, or monotonic stack &mdash; and (3) reason precisely about space complexity, because "use extra memory" is rarely a free pass in a follow-up question.</p>
            <h3>Prefix sums: turning O(n) range queries into O(1)</h3>
            <p>If a range-sum query ("sum of elements from index i to j") is asked repeatedly, precompute a prefix sum array once in O(n), then answer every query in O(1).</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">buildPrefix</span>(nums) {
  <span class="kw">const</span> prefix = <span class="kw">new</span> Array(nums.length + 1).fill(0);
  <span class="kw">for</span> (<span class="kw">let</span> i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  <span class="kw">return</span> prefix; <span class="cm">// rangeSum(i, j) = prefix[j + 1] - prefix[i]</span>
}</pre>
            <h3>Monotonic stack: the O(n) trick behind "next greater element"</h3>
            <p>Problems like <i>Trapping Rain Water</i> or <i>Daily Temperatures</i> look like they need nested loops, but a stack that only ever grows or shrinks monotonically processes each element at most twice &mdash; giving O(n) instead of O(n&sup2;).</p>
            <pre class="code-block"><span class="cm">// For each day, how many days until a warmer temperature?</span>
<span class="kw">function</span> <span class="fn">dailyTemperatures</span>(temps) {
  <span class="kw">const</span> res = <span class="kw">new</span> Array(temps.length).fill(0);
  <span class="kw">const</span> stack = []; <span class="cm">// indices, decreasing temps</span>
  <span class="kw">for</span> (<span class="kw">let</span> i = 0; i < temps.length; i++) {
    <span class="kw">while</span> (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      <span class="kw">const</span> j = stack.pop();
      res[j] = i - j;
    }
    stack.push(i);
  }
  <span class="kw">return</span> res;
}</pre>
            <div class="callout"><b>Interview signal:</b> when you see "subarray", "substring", or "window" combined with a running property (sum, count of distinct chars, max/min) &mdash; sliding window is almost always the answer. When you see "next greater/smaller", reach for a monotonic stack before anything else.</div>
            <h3>Space complexity is part of the answer</h3>
            <p>A senior-level answer states the trade-off explicitly: "I can do this in O(n) time and O(n) space with a hash map, or O(n log n) time and O(1) extra space by sorting first." Naming both options, unprompted, is what separates a strong signal from a merely correct one.</p>
          </div>`
      },
      problems: [
        { title: "Two Sum", difficulty: "Beginner" },
        { title: "Maximum Subarray (Kadane's)", difficulty: "Intermediate" },
        { title: "Trapping Rain Water", difficulty: "Expert" }
      ]
    },
    {
      id: "recursion",
      num: 2,
      title: "Recursion & Backtracking",
      tagline: "Functions that call themselves, and how to search a space of choices.",
      runway: 2,
      tiers: {
        beginner: `
          <div class="lesson-block">
            <h3>The idea in one sentence</h3>
            <p>Recursion solves a problem by solving a smaller version of the same problem, until the version is small enough to answer directly (the <b>base case</b>).</p>
            <div class="callout"><b>Real-world analogy:</b> Russian nesting dolls. To find the smallest doll, you open one, and the same task (find the smallest doll) starts over inside &mdash; just on a smaller doll. Eventually you hit a doll that doesn't open (the base case), and that's your answer.</div>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">factorial</span>(n) {
  <span class="kw">if</span> (n <= 1) <span class="kw">return</span> 1;       <span class="cm">// base case</span>
  <span class="kw">return</span> n * factorial(n - 1); <span class="cm">// smaller subproblem</span>
}</pre>
            <p>Every recursive function needs exactly two things: a base case that stops the recursion, and a recursive case that makes real progress toward that base case. Skip either one and you get infinite recursion &mdash; a stack overflow.</p>
            <h3>What's really happening: the call stack</h3>
            <p>Each call waits for the one it made to finish, so the computer stacks them up like plates. <code>factorial(4)</code> calls <code>factorial(3)</code>, which calls <code>factorial(2)</code>, which calls <code>factorial(1)</code> &mdash; then the answers unwind back down the stack, multiplying as they go.</p>
          </div>`,
        intermediate: `
          <div class="lesson-block">
            <h3>Real-world example: file system search</h3>
            <p>Finding every <code>.log</code> file on a disk is naturally recursive: a folder contains files and other folders, and each of those folders needs the exact same treatment. This "a thing contains smaller things of the same type" shape is the signal to reach for recursion &mdash; it shows up in JSON parsing, DOM traversal, and org-chart processing too.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">findLogFiles</span>(folder) {
  <span class="kw">let</span> results = [];
  <span class="kw">for</span> (<span class="kw">const</span> entry <span class="kw">of</span> folder.contents) {
    <span class="kw">if</span> (entry.isFolder) {
      results = results.concat(findLogFiles(entry)); <span class="cm">// recurse into subfolder</span>
    } <span class="kw">else if</span> (entry.name.endsWith(<span class="str">".log"</span>)) {
      results.push(entry.name);
    }
  }
  <span class="kw">return</span> results;
}</pre>
            <h3>Backtracking: recursion that tries, and undoes</h3>
            <p>Backtracking explores every possible choice by recursing, and when a path turns out to be invalid (or once it's fully explored) it <i>undoes</i> that choice and tries the next one. It's how a store's "build your own gift box" picker enumerates every valid combination of items under a weight limit, or how a scheduling app tries every arrangement of meetings until one fits.</p>
            <pre class="code-block"><span class="cm">// All subsets of a set of numbers</span>
<span class="kw">function</span> <span class="fn">subsets</span>(nums) {
  <span class="kw">const</span> result = [];
  <span class="kw">function</span> <span class="fn">backtrack</span>(start, path) {
    result.push([...path]);              <span class="cm">// record current combination</span>
    <span class="kw">for</span> (<span class="kw">let</span> i = start; i < nums.length; i++) {
      path.push(nums[i]);                 <span class="cm">// choose</span>
      backtrack(i + 1, path);             <span class="cm">// explore</span>
      path.pop();                         <span class="cm">// un-choose (the "backtrack")</span>
    }
  }
  backtrack(0, []);
  <span class="kw">return</span> result;
}</pre>
          </div>`,
        expert: `
          <div class="lesson-block">
            <h3>Pruning: the difference between "works" and "passes"</h3>
            <p>A correct backtracking solution can still time out. The senior-level skill is <b>pruning</b>: detecting that a partial path can never lead to a valid answer, and abandoning it immediately instead of exploring it fully. This is what turns N-Queens from "technically exponential" into "fast enough in practice."</p>
            <pre class="code-block"><span class="cm">// N-Queens: place N queens so none attack each other</span>
<span class="kw">function</span> <span class="fn">solveNQueens</span>(n) {
  <span class="kw">const</span> results = [];
  <span class="kw">const</span> cols = <span class="kw">new</span> Set(), diag1 = <span class="kw">new</span> Set(), diag2 = <span class="kw">new</span> Set();
  <span class="kw">const</span> placement = [];

  <span class="kw">function</span> <span class="fn">backtrack</span>(row) {
    <span class="kw">if</span> (row === n) { results.push([...placement]); <span class="kw">return</span>; }
    <span class="kw">for</span> (<span class="kw">let</span> col = 0; col < n; col++) {
      <span class="cm">// prune immediately if this column/diagonal is already attacked</span>
      <span class="kw">if</span> (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) <span class="kw">continue</span>;
      cols.add(col); diag1.add(row - col); diag2.add(row + col);
      placement.push(col);

      backtrack(row + 1);

      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
      placement.pop();
    }
  }
  backtrack(0);
  <span class="kw">return</span> results;
}</pre>
            <h3>Recursion vs. iteration: the space trade-off</h3>
            <p>Every recursive call adds a frame to the call stack &mdash; O(depth) extra space, which is easy to forget when you're only counting the "obvious" data structures. For linear recursion (like naive Fibonacci without memoization), this also hides an <b>exponential time blowup</b> from recomputing the same subproblems repeatedly.</p>
            <table class="complexity-table">
              <tr><th>Approach</th><th>Time</th><th>Space</th></tr>
              <tr><td class="op">Naive recursive Fibonacci</td><td class="op">O(2&#8319;)</td><td class="op">O(n) stack</td></tr>
              <tr><td class="op">Memoized recursion (top-down DP)</td><td class="op">O(n)</td><td class="op">O(n)</td></tr>
              <tr><td class="op">Iterative with two variables</td><td class="op">O(n)</td><td class="op">O(1)</td></tr>
            </table>
            <div class="callout"><b>Interview signal:</b> if a recursive solution re-solves the same subproblem more than once, say so out loud, then fix it with memoization &mdash; this single move is often exactly what bridges recursion into the Dynamic Programming module.</div>
          </div>`
      },
      problems: [
        { title: "Generate All Subsets", difficulty: "Beginner" },
        { title: "Permutations", difficulty: "Intermediate" },
        { title: "N-Queens", difficulty: "Expert" }
      ]
    },
    {
      id: "linked-lists",
      num: 3,
      title: "Linked Lists",
      tagline: "Nodes and pointers &mdash; the data structure behind undo history and music queues.",
      runway: 2,
      tiers: {
        beginner: `
          <div class="lesson-block">
            <h3>What a linked list is</h3>
            <p>Unlike an array, a linked list doesn't need contiguous memory. Each element (a <b>node</b>) stores its value plus a pointer to the next node. To find the 5th element you must walk from the start, one pointer at a time &mdash; there's no "jump straight to index 5".</p>
            <div class="callout"><b>Real-world analogy:</b> A scavenger hunt where each clue tells you where to find the next clue. You can't skip to clue 5 without first visiting clues 1 through 4.</div>
            <pre class="code-block"><span class="kw">class</span> ListNode {
  <span class="kw">constructor</span>(val) {
    <span class="kw">this</span>.val = val;
    <span class="kw">this</span>.next = <span class="kw">null</span>;
  }
}
<span class="kw">const</span> a = <span class="kw">new</span> ListNode(1);
a.next = <span class="kw">new</span> ListNode(2);
a.next.next = <span class="kw">new</span> ListNode(3); <span class="cm">// 1 -> 2 -> 3 -> null</span></pre>
            <h3>Array vs. linked list</h3>
            <table class="complexity-table">
              <tr><th>Operation</th><th>Array</th><th>Linked List</th></tr>
              <tr><td class="op">Access by index</td><td class="op">O(1)</td><td class="op">O(n)</td></tr>
              <tr><td class="op">Insert / delete at front</td><td class="op">O(n)</td><td class="op">O(1)</td></tr>
              <tr><td class="op">Insert / delete at known node</td><td class="op">O(n)</td><td class="op">O(1)</td></tr>
            </table>
          </div>`,
        intermediate: `
          <div class="lesson-block">
            <h3>Real-world example: undo/redo and music queues</h3>
            <p>A doubly linked list (each node points both forward and backward) is exactly how a text editor's undo history or a music player's "up next" queue works: you constantly insert and remove from the middle without wanting to shift an entire array every time.</p>
            <h3>Reversing a list in place</h3>
            <p>This is the single most common linked-list interview warm-up, and it teaches the pointer-rewiring skill every harder list problem depends on.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">reverseList</span>(head) {
  <span class="kw">let</span> prev = <span class="kw">null</span>, curr = head;
  <span class="kw">while</span> (curr !== <span class="kw">null</span>) {
    <span class="kw">const</span> nextNode = curr.next; <span class="cm">// save before we overwrite it</span>
    curr.next = prev;          <span class="cm">// reverse the pointer</span>
    prev = curr;
    curr = nextNode;
  }
  <span class="kw">return</span> prev; <span class="cm">// new head</span>
}</pre>
            <h3>Fast &amp; slow pointers (Floyd's algorithm)</h3>
            <p>Move one pointer twice as fast as the other. If the list has a cycle, they will eventually meet &mdash; the same technique detects infinite loops in linked data (e.g. a corrupted "next" chain) without any extra memory.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">hasCycle</span>(head) {
  <span class="kw">let</span> slow = head, fast = head;
  <span class="kw">while</span> (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    <span class="kw">if</span> (slow === fast) <span class="kw">return</span> <span class="kw">true</span>;
  }
  <span class="kw">return</span> <span class="kw">false</span>;
}</pre>
          </div>`,
        expert: `
          <div class="lesson-block">
            <h3>Merging, reordering, and the "dummy node" trick</h3>
            <p>Problems like <i>Merge Two Sorted Lists</i> or <i>Reorder List</i> get much cleaner with a <b>dummy head node</b> &mdash; a throwaway node before the real list so you never have to special-case "is this the first node?".</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">mergeTwoLists</span>(l1, l2) {
  <span class="kw">const</span> dummy = <span class="kw">new</span> ListNode(0);
  <span class="kw">let</span> tail = dummy;
  <span class="kw">while</span> (l1 && l2) {
    <span class="kw">if</span> (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
    <span class="kw">else</span>              { tail.next = l2; l2 = l2.next; }
    tail = tail.next;
  }
  tail.next = l1 || l2; <span class="cm">// attach whichever list has leftovers</span>
  <span class="kw">return</span> dummy.next;
}</pre>
            <h3>LRU Cache: linked list + hash map together</h3>
            <p>This is one of the most-asked "design a data structure" interview questions. A Least-Recently-Used cache needs O(1) get and O(1) put, which neither structure gives alone: a hash map gives O(1) lookup but no ordering, a doubly linked list gives O(1) reordering but no O(1) lookup by key. Combined, a hash map of key &rarr; node lets you jump straight to any node, then splice it to the front of a doubly linked list in O(1).</p>
            <div class="callout"><b>Interview signal:</b> whenever you need O(1) access <i>and</i> O(1) reordering/eviction, think "hash map + doubly linked list" &mdash; it's the standard combo behind LRU caches, browser history, and job queues.</div>
            <h3>Detecting the start of a cycle</h3>
            <p>Once fast/slow pointers meet inside a cycle, resetting one pointer to the head and advancing both one step at a time makes them meet exactly at the cycle's start &mdash; a direct consequence of the distance math between the two pointers, and a favorite "explain why this works" follow-up question.</p>
          </div>`
      },
      problems: [
        { title: "Reverse a Linked List", difficulty: "Beginner" },
        { title: "Detect Cycle (Floyd's)", difficulty: "Intermediate" },
        { title: "LRU Cache", difficulty: "Expert" }
      ]
    },
    {
      id: "stacks-queues",
      num: 4,
      title: "Stacks & Queues",
      tagline: "LIFO and FIFO &mdash; the order-of-operations building blocks.",
      runway: 1,
      tiers: {
        beginner: `
          <div class="lesson-block">
            <h3>Stack: last in, first out</h3>
            <div class="callout"><b>Real-world analogy:</b> A stack of plates. You add to the top and remove from the top &mdash; the last plate placed is the first one taken off.</div>
            <pre class="code-block"><span class="kw">const</span> stack = [];
stack.push(1); stack.push(2); stack.push(3);
stack.pop(); <span class="cm">// removes 3 -- the most recently added</span></pre>
            <h3>Queue: first in, first out</h3>
            <div class="callout"><b>Real-world analogy:</b> A checkout line at a store. The first person in line is the first person served.</div>
            <pre class="code-block"><span class="kw">const</span> queue = [];
queue.push(1); queue.push(2); queue.push(3);
queue.shift(); <span class="cm">// removes 1 -- the first one added</span></pre>
            <p class="small-muted">Note: <code>Array.shift()</code> is O(n) in JavaScript because everything shifts left. In production code, queues are usually built on a linked list or a circular buffer to keep dequeue O(1).</p>
          </div>`,
        intermediate: `
          <div class="lesson-block">
            <h3>Real-world example: validating balanced brackets</h3>
            <p>Code editors highlight mismatched brackets using exactly a stack: push every opening bracket, and when a closing bracket appears, it must match whatever is currently on top of the stack.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">isValid</span>(s) {
  <span class="kw">const</span> pairs = { <span class="str">")"</span>: <span class="str">"("</span>, <span class="str">"]"</span>: <span class="str">"["</span>, <span class="str">"}"</span>: <span class="str">"{"</span> };
  <span class="kw">const</span> stack = [];
  <span class="kw">for</span> (<span class="kw">const</span> ch <span class="kw">of</span> s) {
    <span class="kw">if</span> (ch === <span class="str">"("</span> || ch === <span class="str">"["</span> || ch === <span class="str">"{"</span>) {
      stack.push(ch);
    } <span class="kw">else</span> {
      <span class="kw">if</span> (stack.pop() !== pairs[ch]) <span class="kw">return</span> <span class="kw">false</span>;
    }
  }
  <span class="kw">return</span> stack.length === 0;
}</pre>
            <h3>Real-world example: task scheduling with a queue</h3>
            <p>A print spooler or a background job runner processes tasks in the order they arrive &mdash; a FIFO queue. Layer in priority (urgent jobs first) and you get a <b>priority queue</b>, covered in the Heaps module.</p>
            <h3>BFS uses a queue, DFS uses a stack</h3>
            <p>This single fact explains why breadth-first search explores level by level (queue: everyone at the current distance is processed before anyone farther) while depth-first search dives down one path fully before backtracking (stack, or the equivalent recursive call stack).</p>
          </div>`,
        expert: `
          <div class="lesson-block">
            <h3>Monotonic stacks and queues</h3>
            <p>A <b>monotonic stack</b> (only increasing or only decreasing) solves "next greater element" style problems in O(n) &mdash; covered in the Arrays module. A <b>monotonic deque</b> does the same for sliding-window maximum/minimum problems, which show up in real systems monitoring rolling max latency over the last N requests.</p>
            <pre class="code-block"><span class="cm">// Max of every window of size k, in O(n) total</span>
<span class="kw">function</span> <span class="fn">maxSlidingWindow</span>(nums, k) {
  <span class="kw">const</span> deque = []; <span class="cm">// stores indices, values decreasing</span>
  <span class="kw">const</span> result = [];
  <span class="kw">for</span> (<span class="kw">let</span> i = 0; i < nums.length; i++) {
    <span class="kw">while</span> (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    <span class="kw">if</span> (deque[0] <= i - k) deque.shift(); <span class="cm">// drop indices out of window</span>
    <span class="kw">if</span> (i >= k - 1) result.push(nums[deque[0]]);
  }
  <span class="kw">return</span> result;
}</pre>
            <h3>Implementing a queue with two stacks</h3>
            <p>A classic "prove you understand both structures" interview question: two stacks can simulate a FIFO queue by reversing order twice.</p>
            <pre class="code-block"><span class="kw">class</span> QueueWithStacks {
  <span class="kw">constructor</span>() { <span class="kw">this</span>.inStack = []; <span class="kw">this</span>.outStack = []; }
  enqueue(x) { <span class="kw">this</span>.inStack.push(x); }
  dequeue() {
    <span class="kw">if</span> (<span class="kw">this</span>.outStack.length === 0) {
      <span class="kw">while</span> (<span class="kw">this</span>.inStack.length) <span class="kw">this</span>.outStack.push(<span class="kw">this</span>.inStack.pop());
    }
    <span class="kw">return</span> <span class="kw">this</span>.outStack.pop();
  }
}</pre>
            <div class="callout"><b>Interview signal:</b> amortized analysis matters here &mdash; each element only ever gets moved from <code>inStack</code> to <code>outStack</code> once, so despite the nested-looking loop, dequeue is O(1) amortized across many calls.</div>
          </div>`
      },
      problems: [
        { title: "Valid Parentheses", difficulty: "Beginner" },
        { title: "Min Stack", difficulty: "Intermediate" },
        { title: "Sliding Window Maximum", difficulty: "Expert" }
      ]
    },
    {
      id: "hash-tables",
      num: 5,
      title: "Hash Tables",
      tagline: "O(1) average lookup &mdash; the backbone of caches, indexes, and de-duplication.",
      runway: 2,
      tiers: {
        beginner: `
          <div class="lesson-block">
            <h3>What a hash table does</h3>
            <p>A hash table stores key-value pairs and gives near-instant lookup by key, using a <b>hash function</b> to convert a key into an array index. Instead of scanning every item to find "the entry for user 4821", it computes exactly where that entry lives.</p>
            <div class="callout"><b>Real-world analogy:</b> A library that shelves books by a code computed from the title, instead of alphabetically. If you know the title, you compute the same code and go straight to the shelf &mdash; no browsing required.</div>
            <pre class="code-block"><span class="kw">const</span> ages = <span class="kw">new</span> Map();
ages.set(<span class="str">"amir"</span>, 29);
ages.set(<span class="str">"priya"</span>, 34);
console.log(ages.get(<span class="str">"priya"</span>)); <span class="cm">// 34 -- O(1) average lookup</span>
console.log(ages.has(<span class="str">"zaid"</span>));   <span class="cm">// false</span></pre>
            <h3>Collisions</h3>
            <p>Two different keys can hash to the same slot. Hash tables handle this with <b>chaining</b> (each slot holds a small list of entries) or <b>open addressing</b> (probe for the next free slot). This is why worst-case lookup is technically O(n), even though average-case is O(1).</p>
          </div>`,
        intermediate: `
          <div class="lesson-block">
            <h3>Real-world example: caching API responses</h3>
            <p>A frontend caching layer stores request URLs as keys and responses as values, so a repeated request skips the network entirely &mdash; the same idea powers memoization, and CDNs use the same principle at massive scale.</p>
            <h3>Real-world example: counting word frequency</h3>
            <p>Every "most common word" feature (search autocomplete, log analysis, spam filters) starts with a frequency map:</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">wordFrequency</span>(words) {
  <span class="kw">const</span> freq = <span class="kw">new</span> Map();
  <span class="kw">for</span> (<span class="kw">const</span> w <span class="kw">of</span> words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  <span class="kw">return</span> freq;
}</pre>
            <h3>Using a hash set to solve Two Sum in one pass</h3>
            <p>Compare this to the sorted two-pointer version from the Arrays module &mdash; this one works on <i>unsorted</i> input in a single O(n) pass, trading O(n) extra space for not needing to sort first.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">twoSum</span>(nums, target) {
  <span class="kw">const</span> seen = <span class="kw">new</span> Map(); <span class="cm">// value -> index</span>
  <span class="kw">for</span> (<span class="kw">let</span> i = 0; i < nums.length; i++) {
    <span class="kw">const</span> complement = target - nums[i];
    <span class="kw">if</span> (seen.has(complement)) <span class="kw">return</span> [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  <span class="kw">return</span> [-1, -1];
}</pre>
          </div>`,
        expert: `
          <div class="lesson-block">
            <h3>Designing a hash map from scratch</h3>
            <p>"Implement a hash map without using the built-in one" is a common senior-level question. The core pieces: an array of buckets, a hash function that spreads keys evenly, chaining for collisions, and resizing (rehashing every entry into a bigger array) once the load factor gets too high &mdash; which is what keeps operations O(1) average instead of degrading over time.</p>
            <pre class="code-block"><span class="kw">class</span> SimpleHashMap {
  <span class="kw">constructor</span>(capacity = 16) {
    <span class="kw">this</span>.capacity = capacity;
    <span class="kw">this</span>.buckets = Array.from({ length: capacity }, () => []);
    <span class="kw">this</span>.size = 0;
  }
  <span class="fn">_hash</span>(key) {
    <span class="kw">let</span> h = 0;
    <span class="kw">for</span> (<span class="kw">const</span> ch <span class="kw">of</span> String(key)) h = (h * 31 + ch.charCodeAt(0)) % <span class="kw">this</span>.capacity;
    <span class="kw">return</span> h;
  }
  set(key, value) {
    <span class="kw">const</span> bucket = <span class="kw">this</span>.buckets[<span class="kw">this</span>._hash(key)];
    <span class="kw">const</span> entry = bucket.find(e => e[0] === key);
    <span class="kw">if</span> (entry) entry[1] = value; <span class="kw">else</span> { bucket.push([key, value]); <span class="kw">this</span>.size++; }
    <span class="kw">if</span> (<span class="kw">this</span>.size / <span class="kw">this</span>.capacity > 0.75) <span class="kw">this</span>._resize();
  }
  get(key) {
    <span class="kw">const</span> entry = <span class="kw">this</span>.buckets[<span class="kw">this</span>._hash(key)].find(e => e[0] === key);
    <span class="kw">return</span> entry ? entry[1] : <span class="kw">undefined</span>;
  }
  _resize() {
    <span class="kw">const</span> old = <span class="kw">this</span>.buckets;
    <span class="kw">this</span>.capacity *= 2;
    <span class="kw">this</span>.buckets = Array.from({ length: <span class="kw">this</span>.capacity }, () => []);
    <span class="kw">this</span>.size = 0;
    <span class="kw">for</span> (<span class="kw">const</span> bucket <span class="kw">of</span> old) <span class="kw">for</span> (<span class="kw">const</span> [k, v] <span class="kw">of</span> bucket) <span class="kw">this</span>.set(k, v);
  }
}</pre>
            <h3>Grouping problems: anagrams</h3>
            <p>Group words that are anagrams of each other by using a <i>canonical form</i> (sorted letters) as the hash key &mdash; a pattern that generalizes to any "group by some derived signature" problem.</p>
            <div class="callout"><b>Interview signal:</b> when a brute-force solution is O(n&sup2;) purely because it's comparing every pair for a "have I seen something like this" check, ask whether a hash map keyed on a derived signature (sum, remainder, sorted string, frequency count) collapses it to O(n).</div>
          </div>`
      },
      problems: [
        { title: "Two Sum (Hash Map)", difficulty: "Beginner" },
        { title: "Group Anagrams", difficulty: "Intermediate" },
        { title: "Design a Hash Map", difficulty: "Expert" }
      ]
    },
    {
      id: "trees",
      num: 6,
      title: "Trees & BSTs",
      tagline: "Hierarchies, traversals, and why balance matters.",
      runway: 3,
      tiers: {
        beginner: `
          <div class="lesson-block">
            <h3>What a tree is</h3>
            <p>A tree is a hierarchy: one root node, and each node can have children. A <b>binary tree</b> limits each node to at most two children, usually called left and right.</p>
            <div class="callout"><b>Real-world analogy:</b> A company org chart. One CEO at the top, each manager has direct reports, and every employee traces back to the CEO through exactly one path.</div>
            <pre class="code-block"><span class="kw">class</span> TreeNode {
  <span class="kw">constructor</span>(val) {
    <span class="kw">this</span>.val = val;
    <span class="kw">this</span>.left = <span class="kw">null</span>;
    <span class="kw">this</span>.right = <span class="kw">null</span>;
  }
}</pre>
            <h3>The three depth-first traversals</h3>
            <p>These differ only in <i>when</i> you visit the current node relative to its children.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">inorder</span>(node, out = []) {   <span class="cm">// left, node, right</span>
  <span class="kw">if</span> (!node) <span class="kw">return</span> out;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
  <span class="kw">return</span> out;
}</pre>
            <p>Preorder (node, left, right) is useful for copying a tree. Postorder (left, right, node) is useful for deleting one, since you free children before the parent. Inorder on a <b>Binary Search Tree</b> visits values in sorted order &mdash; a fact interviewers love to test.</p>
          </div>`,
        intermediate: `
          <div class="lesson-block">
            <h3>Real-world example: autocomplete and file explorers</h3>
            <p>File explorers, JSON viewers, and comment threads are all trees. Autocomplete specifically uses a <b>trie</b> (prefix tree), where each path from the root spells out a prefix &mdash; letting you fetch every word starting with "pro" without scanning the whole dictionary.</p>
            <h3>Binary Search Trees: sorted order for free</h3>
            <p>A BST keeps every left subtree smaller and every right subtree larger than the current node, which makes search, insert, and delete all O(h) where h is the tree's height &mdash; O(log n) if balanced, but O(n) if it degenerates into a line.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">searchBST</span>(node, target) {
  <span class="kw">if</span> (!node || node.val === target) <span class="kw">return</span> node;
  <span class="kw">return</span> target < node.val
    ? searchBST(node.left, target)
    : searchBST(node.right, target);
}</pre>
            <h3>BFS with a queue: level-order traversal</h3>
            <p>Rendering a tree level by level (like an org chart drawn row by row) uses breadth-first search &mdash; the queue pattern from the Stacks &amp; Queues module.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">levelOrder</span>(root) {
  <span class="kw">if</span> (!root) <span class="kw">return</span> [];
  <span class="kw">const</span> result = [], queue = [root];
  <span class="kw">while</span> (queue.length) {
    <span class="kw">const</span> levelSize = queue.length, level = [];
    <span class="kw">for</span> (<span class="kw">let</span> i = 0; i < levelSize; i++) {
      <span class="kw">const</span> node = queue.shift();
      level.push(node.val);
      <span class="kw">if</span> (node.left) queue.push(node.left);
      <span class="kw">if</span> (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  <span class="kw">return</span> result;
}</pre>
          </div>`,
        expert: `
          <div class="lesson-block">
            <h3>Why balance is the whole game</h3>
            <p>Every BST operation is O(h). A tree built by inserting already-sorted data degenerates into a straight line &mdash; O(n) operations, no better than a linked list. Self-balancing trees (AVL, Red-Black) rebalance on every insert/delete to guarantee O(log n) height. Production databases and language runtimes (Java's <code>TreeMap</code>, most database indexes) rely on exactly this guarantee.</p>
            <h3>Lowest Common Ancestor</h3>
            <p>A staple "reason about tree structure" question: find the deepest node that is an ancestor of both given nodes.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">lowestCommonAncestor</span>(root, p, q) {
  <span class="kw">if</span> (!root || root === p || root === q) <span class="kw">return</span> root;
  <span class="kw">const</span> left = lowestCommonAncestor(root.left, p, q);
  <span class="kw">const</span> right = lowestCommonAncestor(root.right, p, q);
  <span class="kw">if</span> (left && right) <span class="kw">return</span> root; <span class="cm">// p and q split across both sides</span>
  <span class="kw">return</span> left || right;
}</pre>
            <h3>Serializing and deserializing a tree</h3>
            <p>How does a database or an API send a tree structure over the network? Convert it to a flat, unambiguous string (preorder with explicit "null" markers), and reverse the process to rebuild it exactly.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">serialize</span>(node) {
  <span class="kw">if</span> (!node) <span class="kw">return</span> <span class="str">"#"</span>;
  <span class="kw">return</span> node.val + <span class="str">","</span> + serialize(node.left) + <span class="str">","</span> + serialize(node.right);
}
<span class="kw">function</span> <span class="fn">deserialize</span>(data) {
  <span class="kw">const</span> values = data.split(<span class="str">","</span>);
  <span class="kw">let</span> i = 0;
  <span class="kw">function</span> <span class="fn">build</span>() {
    <span class="kw">const</span> val = values[i++];
    <span class="kw">if</span> (val === <span class="str">"#"</span>) <span class="kw">return</span> <span class="kw">null</span>;
    <span class="kw">const</span> node = <span class="kw">new</span> TreeNode(Number(val));
    node.left = build();
    node.right = build();
    <span class="kw">return</span> node;
  }
  <span class="kw">return</span> build();
}</pre>
            <div class="callout"><b>Interview signal:</b> "explain the height guarantee of your data structure" is a common follow-up. Being able to say <i>why</i> a Red-Black tree stays balanced (or at least that it does, and what that buys you) signals real depth, not memorized code.</div>
          </div>`
      },
      problems: [
        { title: "Validate a BST", difficulty: "Beginner" },
        { title: "Lowest Common Ancestor", difficulty: "Intermediate" },
        { title: "Serialize / Deserialize Binary Tree", difficulty: "Expert" }
      ]
    },
    {
      id: "heaps",
      num: 7,
      title: "Heaps & Priority Queues",
      tagline: "Always-sorted-enough structures for 'give me the most important item, fast'.",
      runway: 3,
      tiers: {
        beginner: `
          <div class="lesson-block">
            <h3>What a heap guarantees</h3>
            <p>A heap is a tree with one rule: every parent is smaller (min-heap) or larger (max-heap) than its children. It does <i>not</i> guarantee full sorted order &mdash; only that the root is always the smallest (or largest) element, retrievable in O(1), with insert and remove in O(log n).</p>
            <div class="callout"><b>Real-world analogy:</b> A hospital ER. Patients aren't seen in arrival order &mdash; the most critical case is always seen next, and new arrivals get slotted in by severity without re-sorting the entire waiting room.</div>
            <h3>A priority queue is a heap with a purpose</h3>
            <p>"Priority queue" is the abstract idea ("always give me the highest-priority item"); a binary heap is the most common way to implement it efficiently.</p>
          </div>`,
        intermediate: `
          <div class="lesson-block">
            <h3>Real-world example: task schedulers and Dijkstra's algorithm</h3>
            <p>An OS task scheduler picks the next process to run based on priority, not arrival time &mdash; a direct priority-queue application. Dijkstra's shortest-path algorithm uses the exact same structure to always expand the currently-closest unvisited node next.</p>
            <h3>Building a min-heap on an array</h3>
            <p>Heaps are usually stored in a plain array: for index <code>i</code>, its children live at <code>2i+1</code> and <code>2i+2</code>. No pointers needed.</p>
            <pre class="code-block"><span class="kw">class</span> MinHeap {
  <span class="kw">constructor</span>() { <span class="kw">this</span>.data = []; }
  push(val) {
    <span class="kw">this</span>.data.push(val);
    <span class="kw">let</span> i = <span class="kw">this</span>.data.length - 1;
    <span class="kw">while</span> (i > 0) {
      <span class="kw">const</span> parent = Math.floor((i - 1) / 2);
      <span class="kw">if</span> (<span class="kw">this</span>.data[parent] <= <span class="kw">this</span>.data[i]) <span class="kw">break</span>;
      [<span class="kw">this</span>.data[parent], <span class="kw">this</span>.data[i]] = [<span class="kw">this</span>.data[i], <span class="kw">this</span>.data[parent]];
      i = parent;
    }
  }
  pop() {
    <span class="kw">const</span> top = <span class="kw">this</span>.data[0];
    <span class="kw">const</span> last = <span class="kw">this</span>.data.pop();
    <span class="kw">if</span> (<span class="kw">this</span>.data.length) {
      <span class="kw">this</span>.data[0] = last;
      <span class="kw">this</span>._sinkDown(0);
    }
    <span class="kw">return</span> top;
  }
  _sinkDown(i) {
    <span class="kw">const</span> n = <span class="kw">this</span>.data.length;
    <span class="kw">while</span> (<span class="kw">true</span>) {
      <span class="kw">let</span> smallest = i, l = 2 * i + 1, r = 2 * i + 2;
      <span class="kw">if</span> (l < n && <span class="kw">this</span>.data[l] < <span class="kw">this</span>.data[smallest]) smallest = l;
      <span class="kw">if</span> (r < n && <span class="kw">this</span>.data[r] < <span class="kw">this</span>.data[smallest]) smallest = r;
      <span class="kw">if</span> (smallest === i) <span class="kw">break</span>;
      [<span class="kw">this</span>.data[i], <span class="kw">this</span>.data[smallest]] = [<span class="kw">this</span>.data[smallest], <span class="kw">this</span>.data[i]];
      i = smallest;
    }
  }
}</pre>
          </div>`,
        expert: `
          <div class="lesson-block">
            <h3>Top-K problems: don't sort everything</h3>
            <p>"Find the K largest elements" tempts you toward sorting the whole array &mdash; O(n log n). A heap of size K instead gives O(n log k), which matters enormously when k is small and n is huge (e.g. "top 10 trending posts out of 50 million").</p>
            <pre class="code-block"><span class="cm">// Kth largest element using a min-heap of size k</span>
<span class="kw">function</span> <span class="fn">findKthLargest</span>(nums, k) {
  <span class="kw">const</span> heap = <span class="kw">new</span> MinHeap();
  <span class="kw">for</span> (<span class="kw">const</span> n <span class="kw">of</span> nums) {
    heap.push(n);
    <span class="kw">if</span> (heap.data.length > k) heap.pop(); <span class="cm">// discard the smallest, keep top k</span>
  }
  <span class="kw">return</span> heap.data[0];
}</pre>
            <h3>Merging K sorted lists</h3>
            <p>A classic "combine multiple sources that are each already sorted" problem &mdash; merging log files from K servers by timestamp, for instance. Put the head of each list in a min-heap of size K, always pop the smallest, and push that node's successor back in.</p>
            <table class="complexity-table">
              <tr><th>Approach</th><th>Time</th></tr>
              <tr><td class="op">Merge lists two at a time</td><td class="op">O(NK) &mdash; N total nodes, K lists</td></tr>
              <tr><td class="op">Min-heap of size K</td><td class="op">O(N log K)</td></tr>
            </table>
            <div class="callout"><b>Interview signal:</b> "top K", "K closest", "K most frequent", or "merge K sorted ___" are near-guaranteed heap questions. The size of the heap is almost always K, not N &mdash; that's the whole point of the optimization.</div>
          </div>`
      },
      problems: [
        { title: "Kth Largest Element", difficulty: "Beginner" },
        { title: "Top K Frequent Elements", difficulty: "Intermediate" },
        { title: "Merge K Sorted Lists", difficulty: "Expert" }
      ]
    },
    {
      id: "graphs",
      num: 8,
      title: "Graphs",
      tagline: "Nodes and edges &mdash; modeling networks, dependencies, and maps.",
      runway: 4,
      tiers: {
        beginner: `
          <div class="lesson-block">
            <h3>What a graph is</h3>
            <p>A graph is a set of nodes (vertices) connected by edges. Unlike a tree, a graph can have cycles and a node can connect to any number of other nodes with no hierarchy.</p>
            <div class="callout"><b>Real-world analogy:</b> A social network. People are nodes, friendships are edges. There's no single "root" person &mdash; everyone can connect to everyone else, and cycles (mutual friend groups) are completely normal.</div>
            <h3>Two ways to represent a graph</h3>
            <pre class="code-block"><span class="cm">// Adjacency list -- most common, memory-efficient for sparse graphs</span>
<span class="kw">const</span> graph = {
  A: [<span class="str">"B"</span>, <span class="str">"C"</span>],
  B: [<span class="str">"A"</span>, <span class="str">"D"</span>],
  C: [<span class="str">"A"</span>],
  D: [<span class="str">"B"</span>]
};</pre>
            <p>An <b>adjacency matrix</b> (a 2D grid of 0s and 1s) is the alternative &mdash; O(1) to check if an edge exists, but O(V&sup2;) space even for sparse graphs.</p>
          </div>`,
        intermediate: `
          <div class="lesson-block">
            <h3>Real-world example: dependency resolution</h3>
            <p>Package managers (npm, pip) and build systems model dependencies as a graph, then use <b>topological sort</b> to decide install order: every package must be installed after everything it depends on. This only works if the graph has no cycles &mdash; a circular dependency is detected as an actual cycle in the graph.</p>
            <h3>BFS: shortest path in an unweighted graph</h3>
            <p>The same queue-based level-order idea from trees, generalized: BFS finds the shortest path (in number of edges) between two nodes, which is exactly how "degrees of separation" or "shortest route with equal-cost roads" features work.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">bfsShortestPath</span>(graph, start, target) {
  <span class="kw">const</span> visited = <span class="kw">new</span> Set([start]);
  <span class="kw">const</span> queue = [[start, 0]];
  <span class="kw">while</span> (queue.length) {
    <span class="kw">const</span> [node, dist] = queue.shift();
    <span class="kw">if</span> (node === target) <span class="kw">return</span> dist;
    <span class="kw">for</span> (<span class="kw">const</span> neighbor <span class="kw">of</span> graph[node] || []) {
      <span class="kw">if</span> (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  <span class="kw">return</span> -1;
}</pre>
            <h3>DFS: exploring every path</h3>
            <p>Used for maze-solving, detecting cycles, and counting connected regions (like "number of islands" on a grid).</p>
          </div>`,
        expert: `
          <div class="lesson-block">
            <h3>Dijkstra's algorithm: shortest path with weighted edges</h3>
            <p>When edges have different costs (real road distances, network latency), plain BFS breaks down. Dijkstra's algorithm uses a min-heap (priority queue) to always expand the currently-cheapest reachable node next &mdash; the same heap pattern from the previous module, applied to graphs.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">dijkstra</span>(graph, start) {
  <span class="cm">// graph[node] = [[neighbor, weight], ...]</span>
  <span class="kw">const</span> dist = { [start]: 0 };
  <span class="kw">const</span> heap = <span class="kw">new</span> MinHeap(); <span class="cm">// simplified: assume it stores [distance, node] pairs by distance</span>
  heap.push([0, start]);
  <span class="kw">while</span> (heap.data.length) {
    <span class="kw">const</span> [d, node] = heap.pop();
    <span class="kw">if</span> (d > (dist[node] ?? Infinity)) <span class="kw">continue</span>; <span class="cm">// stale entry, skip</span>
    <span class="kw">for</span> (<span class="kw">const</span> [next, weight] <span class="kw">of</span> graph[node] || []) {
      <span class="kw">const</span> nd = d + weight;
      <span class="kw">if</span> (nd < (dist[next] ?? Infinity)) {
        dist[next] = nd;
        heap.push([nd, next]);
      }
    }
  }
  <span class="kw">return</span> dist;
}</pre>
            <h3>Topological sort via DFS</h3>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">topoSort</span>(graph) {
  <span class="kw">const</span> visited = <span class="kw">new</span> Set(), order = [];
  <span class="kw">function</span> <span class="fn">dfs</span>(node) {
    visited.add(node);
    <span class="kw">for</span> (<span class="kw">const</span> next <span class="kw">of</span> graph[node] || []) {
      <span class="kw">if</span> (!visited.has(next)) dfs(next);
    }
    order.push(node); <span class="cm">// add AFTER exploring all dependents</span>
  }
  <span class="kw">for</span> (<span class="kw">const</span> node <span class="kw">in</span> graph) <span class="kw">if</span> (!visited.has(node)) dfs(node);
  <span class="kw">return</span> order.reverse();
}</pre>
            <table class="complexity-table">
              <tr><th>Algorithm</th><th>Use case</th><th>Time</th></tr>
              <tr><td class="op">BFS</td><td class="op">Shortest path, unweighted</td><td class="op">O(V+E)</td></tr>
              <tr><td class="op">DFS</td><td class="op">Cycle detection, connectivity</td><td class="op">O(V+E)</td></tr>
              <tr><td class="op">Dijkstra</td><td class="op">Shortest path, weighted (non-negative)</td><td class="op">O((V+E) log V)</td></tr>
            </table>
            <div class="callout"><b>Interview signal:</b> if weights can be negative, Dijkstra breaks &mdash; naming Bellman-Ford as the fallback (and knowing it handles negative weights in O(VE)) is a strong senior-level signal.</div>
          </div>`
      },
      problems: [
        { title: "Number of Islands", difficulty: "Beginner" },
        { title: "Course Schedule (Cycle Detection)", difficulty: "Intermediate" },
        { title: "Network Delay Time (Dijkstra)", difficulty: "Expert" }
      ]
    },
    {
      id: "sorting-searching",
      num: 9,
      title: "Sorting & Searching",
      tagline: "The algorithms every other algorithm quietly depends on.",
      runway: 2,
      tiers: {
        beginner: `
          <div class="lesson-block">
            <h3>Binary search: halving the problem every step</h3>
            <p>On a <i>sorted</i> array, you don't need to check every element &mdash; check the middle, and eliminate half the array based on one comparison.</p>
            <div class="callout"><b>Real-world analogy:</b> Looking up a word in a physical dictionary. You don't start at page 1 &mdash; you open to the middle, see you've gone too far or not far enough, and jump accordingly.</div>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">binarySearch</span>(nums, target) {
  <span class="kw">let</span> lo = 0, hi = nums.length - 1;
  <span class="kw">while</span> (lo <= hi) {
    <span class="kw">const</span> mid = Math.floor((lo + hi) / 2);
    <span class="kw">if</span> (nums[mid] === target) <span class="kw">return</span> mid;
    <span class="kw">if</span> (nums[mid] < target) lo = mid + 1;
    <span class="kw">else</span> hi = mid - 1;
  }
  <span class="kw">return</span> -1;
}</pre>
            <p>O(log n) &mdash; for a billion sorted items, that's roughly 30 comparisons instead of a billion.</p>
            <h3>Bubble sort, and why it's mostly a teaching tool</h3>
            <p>Repeatedly swap adjacent out-of-order elements. Simple to understand, O(n&sup2;), and rarely used in production &mdash; but it's the clearest introduction to the idea of "sorting by repeated comparison."</p>
          </div>`,
        intermediate: `
          <div class="lesson-block">
            <h3>Real-world example: search suggestions and leaderboards</h3>
            <p>Any "find where this new score fits in a ranked leaderboard" feature is binary search in disguise. Autocomplete systems binary-search a sorted list of terms to find every entry matching a prefix range.</p>
            <h3>Merge sort: divide, conquer, combine</h3>
            <p>Split the array in half, sort each half recursively, then merge the two sorted halves. Guaranteed O(n log n) regardless of input &mdash; this predictability is why it's the basis for stable, external, and parallel sorting in real systems.</p>
            <pre class="code-block"><span class="kw">function</span> <span class="fn">mergeSort</span>(arr) {
  <span class="kw">if</span> (arr.length <= 1) <span class="kw">return</span> arr;
  <span class="kw">const</span> mid = Math.floor(arr.length / 2);
  <span class="kw">const</span> left = mergeSort(arr.slice(0, mid));
  <span class="kw">const</span> right = mergeSort(arr.slice(mid));
  <span class="kw">const</span> merged = [];
  <span class="kw">let</span> i = 0, j = 0;
  <span class="kw">while</span> (i < left.length && j < right.length) {
    merged.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  <span class="kw">return</span> merged.concat(left.slice(i), right.slice(j));
}</pre>
            <h3>Quicksort: partition around a pivot</h3>
            <p>Pick a pivot, partition everything smaller to its left and larger to its right, then recurse on each side. Average O(n log n) and typically faster in practice than merge sort due to better cache locality, but O(n&sup2;) worst case on adversarial input &mdash; which is exactly what a strong answer should mention.</p>
          </div>`,
        expert: `
          <div class="lesson-block">
            <h3>Binary search on the answer</h3>
            <p>A senior-level pattern: when a problem asks "find the minimum/maximum X such that some condition holds", and that condition is monotonic (true for all X beyond some threshold), binary search the <i>answer space</i> itself, not an array.</p>
            <pre class="code-block"><span class="cm">// Minimum days to ship all packages within D days, given a max daily capacity</span>
<span class="kw">function</span> <span class="fn">shipWithinDays</span>(weights, days) {
  <span class="kw">let</span> lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
  <span class="kw">function</span> <span class="fn">canShip</span>(capacity) {
    <span class="kw">let</span> daysNeeded = 1, load = 0;
    <span class="kw">for</span> (<span class="kw">const</span> w <span class="kw">of</span> weights) {
      <span class="kw">if</span> (load + w > capacity) { daysNeeded++; load = 0; }
      load += w;
    }
    <span class="kw">return</span> daysNeeded <= days;
  }
  <span class="kw">while</span> (lo < hi) {
    <span class="kw">const</span> mid = Math.floor((lo + hi) / 2);
    <span class="kw">if</span> (canShip(mid)) hi = mid; <span class="kw">else</span> lo = mid + 1;
  }
  <span class="kw">return</span> lo;
}</pre>
            <h3>Quickselect: Kth element without fully sorting</h3>
            <p>Finding the Kth smallest/largest element doesn't require sorting the whole array. Quickselect partitions like quicksort but only recurses into the side that contains the target index &mdash; O(n) average instead of O(n log n).</p>
            <table class="complexity-table">
              <tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th></tr>
              <tr><td class="op">Merge sort</td><td class="op">O(n log n)</td><td class="op">O(n log n)</td><td class="op">O(n log n)</td><td class="op">O(n)</td></tr>
              <tr><td class="op">Quicksort</td><td class="op">O(n log n)</td><td class="op">O(n log n)</td><td class="op">O(n&sup2;)</td><td class="op">O(log n)</td></tr>
              <tr><td class="op">Binary search</td><td class="op">O(1)</td><td class="op">O(log n)</td><td class="op">O(log n)</td><td class="op">O(1)</td></tr>
            </table>
            <div class="callout"><b>Interview signal:</b> whenever the words "minimum possible maximum" or "find the smallest value such that..." appear, that's binary-search-on-the-answer, not a scan &mdash; a pattern many candidates never learn even after mastering standard binary search.</div>
          </div>`
      },
      problems: [
        { title: "Binary Search", difficulty: "Beginner" },
        { title: "Search in Rotated Sorted Array", difficulty: "Intermediate" },
        { title: "Median of Two Sorted Arrays", difficulty: "Expert" }
      ]
    },
    {
      id: "dynamic-programming",
      num: 10,
      title: "Dynamic Programming",
      tagline: "Turning exponential brute force into polynomial time by remembering what you've already solved.",
      runway: 5,
      tiers: {
        beginner: `
          <div class="lesson-block">
            <h3>The core idea: don't solve the same subproblem twice</h3>
            <p>Dynamic Programming (DP) applies when a problem has <b>overlapping subproblems</b> (the same smaller question gets asked repeatedly) and <b>optimal substructure</b> (the best overall answer is built from the best answers to subproblems). Instead of recomputing, store the answer to each subproblem the first time you solve it.</p>
            <div class="callout"><b>Real-world analogy:</b> Doing your taxes with a spreadsheet instead of a calculator. Once you've computed "total deductible expenses for March", you write it down and reuse it &mdash; you don't recalculate it from receipts every time a later formula needs it.</div>
            <h3>Fibonacci: from exponential to linear</h3>
            <pre class="code-block"><span class="cm">// Naive: O(2^n) -- recomputes fib(2) hundreds of times for large n</span>
<span class="kw">function</span> <span class="fn">fibSlow</span>(n) {
  <span class="kw">if</span> (n <= 1) <span class="kw">return</span> n;
  <span class="kw">return</span> fibSlow(n - 1) + fibSlow(n - 2);
}

<span class="cm">// Memoized: O(n) -- each subproblem solved exactly once</span>
<span class="kw">function</span> <span class="fn">fibFast</span>(n, memo = {}) {
  <span class="kw">if</span> (n <= 1) <span class="kw">return</span> n;
  <span class="kw">if</span> (n <span class="kw">in</span> memo) <span class="kw">return</span> memo[n];
  <span class="kw">return</span> memo[n] = fibFast(n - 1, memo) + fibFast(n - 2, memo);
}</pre>
          </div>`,
        intermediate: `
          <div class="lesson-block">
            <h3>Real-world example: making change and resource allocation</h3>
            <p>ATMs computing the fewest bills/coins for a withdrawal, and cloud cost optimizers deciding which resources to allocate under a budget, are both instances of the same underlying pattern: the <b>Knapsack</b> problem &mdash; choose items to maximize value under a constraint.</p>
            <h3>Top-down vs. bottom-up</h3>
            <p>Top-down keeps the natural recursive structure and adds a memo cache (like <code>fibFast</code> above). Bottom-up builds a table iteratively from the smallest subproblem upward, avoiding recursion overhead entirely.</p>
            <pre class="code-block"><span class="cm">// Coin Change: fewest coins to make an amount -- bottom-up</span>
<span class="kw">function</span> <span class="fn">coinChange</span>(coins, amount) {
  <span class="kw">const</span> dp = <span class="kw">new</span> Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  <span class="kw">for</span> (<span class="kw">let</span> a = 1; a <= amount; a++) {
    <span class="kw">for</span> (<span class="kw">const</span> coin <span class="kw">of</span> coins) {
      <span class="kw">if</span> (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  <span class="kw">return</span> dp[amount] === Infinity ? -1 : dp[amount];
}</pre>
            <h3>Recognizing the shape: House Robber</h3>
            <p>"At each step, either take this and skip the next, or skip this" is a recurring DP shape (house robber, job scheduling with cooldowns) where <code>dp[i] = max(dp[i-1], dp[i-2] + value[i])</code>.</p>
          </div>`,
        expert: `
          <div class="lesson-block">
            <h3>2D DP: Longest Common Subsequence &amp; Edit Distance</h3>
            <p>Diff tools (git diff), spell-checkers, and DNA sequence alignment all rely on 2D DP: build a table where <code>dp[i][j]</code> represents the answer using the first <code>i</code> characters of one input and the first <code>j</code> of another.</p>
            <pre class="code-block"><span class="cm">// Edit Distance: min operations to turn word1 into word2</span>
<span class="kw">function</span> <span class="fn">editDistance</span>(word1, word2) {
  <span class="kw">const</span> m = word1.length, n = word2.length;
  <span class="kw">const</span> dp = Array.from({ length: m + 1 }, () => <span class="kw">new</span> Array(n + 1).fill(0));
  <span class="kw">for</span> (<span class="kw">let</span> i = 0; i <= m; i++) dp[i][0] = i;
  <span class="kw">for</span> (<span class="kw">let</span> j = 0; j <= n; j++) dp[0][j] = j;
  <span class="kw">for</span> (<span class="kw">let</span> i = 1; i <= m; i++) {
    <span class="kw">for</span> (<span class="kw">let</span> j = 1; j <= n; j++) {
      <span class="kw">if</span> (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      <span class="kw">else</span> dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  <span class="kw">return</span> dp[m][n];
}</pre>
            <h3>Space optimization: rolling arrays</h3>
            <p>Notice <code>dp[i][j]</code> in Edit Distance only ever needs the previous row. That observation shrinks O(m&times;n) space to O(n) &mdash; a follow-up interviewers frequently ask for after the first working version.</p>
            <h3>Longest Increasing Subsequence: O(n&sup2;) &rarr; O(n log n)</h3>
            <p>The straightforward DP is O(n&sup2;). The optimized version maintains a small array of "smallest tail of an increasing subsequence of length L" and binary-searches it &mdash; combining two entire earlier modules (DP and binary search) into one technique.</p>
            <div class="callout"><b>Interview signal:</b> a strong DP answer names the recurrence relation explicitly before coding ("dp[i] depends on dp[i-1] and dp[i-2] because...") &mdash; verbalizing the recurrence is what proves you derived it rather than pattern-matched a memorized solution.</div>
          </div>`
      },
      problems: [
        { title: "Climbing Stairs", difficulty: "Beginner" },
        { title: "Coin Change", difficulty: "Intermediate" },
        { title: "Edit Distance", difficulty: "Expert" }
      ]
    }
  ]
};

/* ============================================================
   QUIZ BANK — level-based assessment
   ============================================================ */
const QUIZ_DATA = {
  beginner: [
    { q: "What is the time complexity of accessing an element by index in an array?", options: ["O(1)", "O(n)", "O(log n)", "O(n\u00b2)"], answer: 0, explain: "Arrays support direct index math, so access is constant time." },
    { q: "Which structure removes elements in the same order they were added?", options: ["Stack", "Queue", "Heap", "Binary tree"], answer: 1, explain: "Queue is FIFO: first in, first out." },
    { q: "What does a base case do in a recursive function?", options: ["Speeds up the loop", "Stops the recursion", "Sorts the input", "Allocates memory"], answer: 1, explain: "Without a base case, recursion never terminates." },
    { q: "In a singly linked list, what is the time complexity to insert at the head?", options: ["O(n)", "O(log n)", "O(1)", "O(n\u00b2)"], answer: 2, explain: "You just repoint the head pointer — no shifting needed." },
    { q: "What is the average time complexity of a hash table lookup?", options: ["O(n)", "O(1)", "O(log n)", "O(n log n)"], answer: 1, explain: "A good hash function distributes keys evenly, giving near-constant lookup." },
    { q: "Which traversal visits a Binary Search Tree's values in sorted order?", options: ["Preorder", "Postorder", "Inorder", "Level-order"], answer: 2, explain: "Inorder visits left, node, right — which is sorted order for a BST." },
    { q: "What does LIFO stand for, describing a stack?", options: ["Last In First Out", "Least In First Out", "Last In Final Out", "Linear In Fast Out"], answer: 0, explain: "The most recently pushed item is the first one popped." },
    { q: "What is the worst-case time complexity of binary search on a sorted array?", options: ["O(n)", "O(1)", "O(log n)", "O(n log n)"], answer: 2, explain: "Each comparison halves the search space." },
    { q: "A heap's root always contains:", options: ["A random element", "The most recently added element", "The min or max element", "The middle element"], answer: 2, explain: "That's the defining heap property — min-heap root is smallest, max-heap root is largest." },
    { q: "What best describes a graph, compared to a tree?", options: ["A graph must have a single root", "A graph can contain cycles", "A graph cannot have edges", "A graph is always sorted"], answer: 1, explain: "Trees are acyclic by definition; general graphs can have cycles." }
  ],
  intermediate: [
    { q: "Which pattern is best suited to find the max sum of any contiguous subarray of fixed size k?", options: ["Two pointers on sorted array", "Sliding window", "Binary search", "Backtracking"], answer: 1, explain: "Sliding window avoids recomputation by adding/removing one element per step." },
    { q: "What's the time complexity of merge sort in all cases?", options: ["O(n)", "O(n\u00b2)", "O(n log n)", "O(log n)"], answer: 2, explain: "Merge sort always divides in half and merges linearly, regardless of input order." },
    { q: "Floyd's cycle detection algorithm uses:", options: ["Two pointers moving at different speeds", "A hash set of visited nodes", "Recursion depth counting", "Sorting the list first"], answer: 0, explain: "A fast and slow pointer will eventually meet if a cycle exists — O(1) space." },
    { q: "Which data structure combo gives O(1) get and O(1) put for an LRU cache?", options: ["Array + stack", "Hash map + doubly linked list", "Two stacks", "Binary search tree"], answer: 1, explain: "Hash map gives O(1) lookup, doubly linked list gives O(1) reordering/eviction." },
    { q: "Topological sort is only valid on a graph that is:", options: ["Weighted", "Undirected", "A DAG (no cycles)", "Fully connected"], answer: 2, explain: "A cycle means there's no valid linear dependency order." },
    { q: "What is the average-case time complexity of quicksort?", options: ["O(n)", "O(n log n)", "O(n\u00b2)", "O(log n)"], answer: 1, explain: "Average case with a reasonable pivot choice is O(n log n); worst case is O(n\u00b2)." },
    { q: "BFS explores a graph:", options: ["Level by level, using a queue", "Depth-first, using a stack", "Randomly", "Only on trees, never graphs"], answer: 0, explain: "BFS processes all nodes at the current distance before moving farther out." },
    { q: "Which is the correct recurrence idea behind the House Robber DP problem?", options: ["dp[i] = dp[i-1] * dp[i-2]", "dp[i] = max(dp[i-1], dp[i-2] + value[i])", "dp[i] = dp[i-1] + value[i]", "dp[i] = min(dp[i-1], dp[i-2])"], answer: 1, explain: "At each house, you either skip it (dp[i-1]) or rob it plus the best from two houses back." },
    { q: "A monotonic stack is most useful for problems like:", options: ["Sorting a large array", "Next greater element", "Binary search", "Hashing strings"], answer: 1, explain: "It processes each element at most twice, giving O(n) for 'next greater/smaller' problems." },
    { q: "Why use a dummy head node when merging two linked lists?", options: ["It makes the list circular", "It avoids special-casing the first node", "It reduces time complexity", "It's required by JavaScript"], answer: 1, explain: "A dummy node means you never need an if-statement for 'is this the very first node'." }
  ],
  expert: [
    { q: "Why does Dijkstra's algorithm fail with negative edge weights?", options: ["It runs out of memory", "It can permanently commit to a suboptimal shortest distance too early", "It becomes O(n\u00b2)", "It only works on trees"], answer: 1, explain: "Dijkstra greedily finalizes the shortest known distance, which negative edges can invalidate later." },
    { q: "Quickselect finds the Kth smallest element in what average time?", options: ["O(n log n)", "O(n)", "O(n\u00b2)", "O(log n)"], answer: 1, explain: "Unlike quicksort, quickselect only recurses into the partition containing the target index." },
    { q: "What technique reduces Longest Increasing Subsequence from O(n\u00b2) to O(n log n)?", options: ["Memoized recursion only", "Maintaining tails array with binary search", "Sorting the input first", "Using a hash map instead of an array"], answer: 1, explain: "Binary-searching a 'smallest tail per length' array collapses the inner loop." },
    { q: "In the Edit Distance DP table, what space optimization is possible?", options: ["None, 2D is required", "Reduce to O(n) using a rolling row", "Reduce to O(1) always", "Convert to a graph problem"], answer: 1, explain: "Each row only depends on the previous row, so you can discard older rows." },
    { q: "'Binary search on the answer' applies when:", options: ["The input array is unsorted", "The condition being tested is monotonic across the answer range", "You need the exact index of a value", "The array has duplicates"], answer: 1, explain: "Monotonicity (true beyond some threshold) is what allows halving the search space of possible answers." },
    { q: "A min-heap of size K is used for 'find K largest elements' because:", options: ["It sorts the whole array faster", "It keeps memory usage proportional to K instead of N", "It guarantees O(1) time", "Heaps can't be used for this"], answer: 1, explain: "You only ever hold K elements, giving O(n log k) instead of O(n log n) for a full sort." },
    { q: "What does amortized O(1) mean for dynamic array insertion at the end?", options: ["Every single insertion takes exactly O(1)", "Occasional O(n) resizes are averaged out over many O(1) insertions", "It's actually O(n) always", "It only applies to linked lists"], answer: 1, explain: "Doubling capacity on resize means resizes become rare enough that the average cost per insert is O(1)." },
    { q: "Why might a hash map degrade toward O(n) lookup in the worst case?", options: ["JavaScript engines are slow", "Too many keys collide into the same bucket", "The array is sorted", "Keys are too short"], answer: 1, explain: "Poor hash distribution or adversarial input can cause many keys to collide into one bucket/chain." },
    { q: "What's the benefit of a self-balancing tree (e.g. Red-Black) over a plain BST?", options: ["Uses less memory", "Guarantees O(log n) height regardless of insertion order", "Removes the need for comparisons", "Makes traversal unnecessary"], answer: 1, explain: "A plain BST can degrade to O(n) height on sorted input; self-balancing trees prevent that." },
    { q: "In DP, 'optimal substructure' means:", options: ["The problem has no valid solution", "The optimal overall answer can be built from optimal answers to subproblems", "The array must be sorted first", "Recursion is not allowed"], answer: 1, explain: "This is one of the two properties (with overlapping subproblems) required for DP to apply." }
  ]
};

/* ============================================================
   INTERVIEW QUESTION BANK — commonly asked at large tech companies
   ============================================================ */
const INTERVIEW_QUESTIONS = [
  {
    title: "Two Sum",
    category: "Arrays & Hashing",
    difficulty: "Easy",
    companies: ["Google", "Amazon", "Meta", "Apple"],
    prompt: "Given an array of integers and a target, return the indices of the two numbers that add up to the target. Assume exactly one solution exists.",
    approach: "Walk the array once. For each number, check if its complement (target minus the number) has already been seen using a hash map. If so, you've found the pair; if not, record the current number and index for future lookups.",
    complexity: "O(n) time, O(n) space",
    code: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`
  },
  {
    title: "Valid Parentheses",
    category: "Stacks & Queues",
    difficulty: "Easy",
    companies: ["Google", "Microsoft", "Amazon"],
    prompt: "Given a string of brackets ( ) [ ] { }, determine if every opening bracket is closed by the same type in the correct order.",
    approach: "Push every opening bracket onto a stack. On a closing bracket, it must match the top of the stack; pop it if it does, otherwise the string is invalid. At the end, the stack must be empty.",
    complexity: "O(n) time, O(n) space",
    code: `function isValid(s) {
  const map = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (stack.pop() !== map[ch]) return false;
  }
  return stack.length === 0;
}`
  },
  {
    title: "Reverse a Linked List",
    category: "Linked Lists",
    difficulty: "Easy",
    companies: ["Google", "Amazon", "Meta"],
    prompt: "Reverse a singly linked list in place and return the new head.",
    approach: "Walk the list with a previous pointer starting at null. At each node, save its next pointer, rewire the node to point backward to prev, then advance both prev and curr forward.",
    complexity: "O(n) time, O(1) space",
    code: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`
  },
  {
    title: "Merge Intervals",
    category: "Arrays & Sorting",
    difficulty: "Medium",
    companies: ["Google", "Meta", "Amazon", "Microsoft"],
    prompt: "Given a list of intervals, merge all overlapping intervals and return the resulting non-overlapping list.",
    approach: "Sort intervals by start time. Walk through them, and whenever the current interval overlaps the last merged one (its start is <= the last one's end), extend the last one's end instead of adding a new interval.",
    complexity: "O(n log n) time (dominated by the sort), O(n) space",
    code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const [start, end] = intervals[i];
    if (start <= last[1]) last[1] = Math.max(last[1], end);
    else result.push([start, end]);
  }
  return result;
}`
  },
  {
    title: "Longest Substring Without Repeating Characters",
    category: "Sliding Window",
    difficulty: "Medium",
    companies: ["Amazon", "Google", "Apple", "Meta"],
    prompt: "Given a string, find the length of the longest substring that contains no repeated characters.",
    approach: "Slide a window across the string using two pointers. Track characters currently in the window with a set (or last-seen index map). When a repeat is found, shrink the window from the left until the repeat is gone.",
    complexity: "O(n) time, O(min(n, charset)) space",
    code: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`
  },
  {
    title: "Number of Islands",
    category: "Graphs / Grid DFS",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Meta"],
    prompt: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
    approach: "Scan every cell. When an unvisited land cell is found, increment the island count and flood-fill (DFS or BFS) in all four directions, marking every connected land cell as visited so it isn't counted again.",
    complexity: "O(rows \u00d7 cols) time and space",
    code: `function numIslands(grid) {
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function sink(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; sink(r, c); }
    }
  }
  return count;
}`
  },
  {
    title: "Course Schedule",
    category: "Graphs / Topological Sort",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Microsoft"],
    prompt: "Given a number of courses and a list of prerequisite pairs, determine whether it's possible to finish all courses (i.e. the prerequisite graph has no cycle).",
    approach: "Model courses as a directed graph. Run DFS while tracking nodes on the current recursion path; if you revisit a node still on that path, there's a cycle. Otherwise mark it fully processed once its DFS finishes.",
    complexity: "O(V + E) time, O(V + E) space",
    code: `function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) graph[course].push(pre);
  const state = new Array(numCourses).fill(0); // 0=unvisited,1=visiting,2=done
  function dfs(node) {
    if (state[node] === 1) return false; // cycle
    if (state[node] === 2) return true;
    state[node] = 1;
    for (const next of graph[node]) if (!dfs(next)) return false;
    state[node] = 2;
    return true;
  }
  for (let i = 0; i < numCourses; i++) if (!dfs(i)) return false;
  return true;
}`
  },
  {
    title: "LRU Cache",
    category: "Design",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
    prompt: "Design a Least Recently Used cache with O(1) get and put, evicting the least recently used entry when capacity is exceeded.",
    approach: "Combine a hash map (key to node) with a doubly linked list ordered by recency. On access, move the node to the front. On overflow, evict the node at the back and remove it from the map.",
    complexity: "O(1) time per operation, O(capacity) space",
    code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // Map preserves insertion order in JS
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val); // move to most-recently-used position
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      this.map.delete(this.map.keys().next().value); // evict least recently used
    }
    this.map.set(key, value);
  }
}`
  },
  {
    title: "Top K Frequent Elements",
    category: "Heaps",
    difficulty: "Medium",
    companies: ["Amazon", "Google", "Meta"],
    prompt: "Given an array of integers, return the k most frequent elements.",
    approach: "Count frequencies with a hash map, then use bucket sort by frequency (index = frequency, value = list of numbers with that frequency) to avoid a full O(n log n) sort, reading off the top k from the highest-frequency buckets.",
    complexity: "O(n) time, O(n) space",
    code: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq) buckets[count].push(num);
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const num of buckets[i]) {
      result.push(num);
      if (result.length === k) break;
    }
  }
  return result;
}`
  },
  {
    title: "Word Break",
    category: "Dynamic Programming",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Meta"],
    prompt: "Given a string and a dictionary of words, determine if the string can be segmented into a sequence of one or more dictionary words.",
    approach: "dp[i] means the substring ending at index i can be segmented. For each i, check every j < i: if dp[j] is true and the substring from j to i is in the dictionary, then dp[i] is true.",
    complexity: "O(n\u00b2) time, O(n) space",
    code: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length];
}`
  },
  {
    title: "Climbing Stairs",
    category: "Dynamic Programming",
    difficulty: "Easy",
    companies: ["Amazon", "Apple", "Adobe"],
    prompt: "You can climb 1 or 2 steps at a time. Given n stairs, how many distinct ways can you reach the top?",
    approach: "The number of ways to reach step n is the sum of the ways to reach step n-1 and step n-2 (you arrive at n either from a 1-step or a 2-step move) — the same recurrence as Fibonacci.",
    complexity: "O(n) time, O(1) space",
    code: `function climbStairs(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`
  },
  {
    title: "House Robber",
    category: "Dynamic Programming",
    difficulty: "Medium",
    companies: ["Google", "Amazon"],
    prompt: "Given an array of amounts of money in houses along a street, find the max amount you can rob without robbing two adjacent houses.",
    approach: "At each house, decide: skip it (carry forward the best without it) or rob it plus the best total from two houses back. Track only the last two results to keep space O(1).",
    complexity: "O(n) time, O(1) space",
    code: `function rob(nums) {
  let prev = 0, curr = 0;
  for (const n of nums) {
    [prev, curr] = [curr, Math.max(curr, prev + n)];
  }
  return curr;
}`
  },
  {
    title: "Product of Array Except Self",
    category: "Arrays",
    difficulty: "Medium",
    companies: ["Amazon", "Meta", "Microsoft"],
    prompt: "Given an array, return an array where each element is the product of every other element, without using division and in O(n).",
    approach: "Make two passes: first compute the running product of everything to the left of each index, then multiply in the running product of everything to the right in a second pass.",
    complexity: "O(n) time, O(1) extra space (excluding output)",
    code: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) { result[i] = left; left *= nums[i]; }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) { result[i] *= right; right *= nums[i]; }
  return result;
}`
  },
  {
    title: "Meeting Rooms II",
    category: "Greedy / Heaps",
    difficulty: "Medium",
    companies: ["Google", "Meta", "Amazon"],
    prompt: "Given meeting time intervals, find the minimum number of conference rooms required so no two meetings overlap in the same room.",
    approach: "Sort start and end times separately. Walk through meetings by start time; use a min-heap (or a pointer over sorted end times) of currently occupied rooms' end times, reusing a room whenever the earliest-ending meeting has already finished.",
    complexity: "O(n log n) time, O(n) space",
    code: `function minMeetingRooms(intervals) {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  let rooms = 0, maxRooms = 0, e = 0;
  for (let s = 0; s < starts.length; s++) {
    if (starts[s] < ends[e]) rooms++; else e++;
    maxRooms = Math.max(maxRooms, rooms);
  }
  return maxRooms;
}`
  },
  {
    title: "Subsets",
    category: "Backtracking",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Meta"],
    prompt: "Given a set of distinct integers, return all possible subsets (the power set).",
    approach: "Backtrack over the array: at each index, recurse both including and excluding the current element, recording the current combination at every recursive call.",
    complexity: "O(2\u207f) time and space",
    code: `function subsets(nums) {
  const result = [];
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}`
  },
  {
    title: "Kth Largest Element in an Array",
    category: "Heaps",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Apple"],
    prompt: "Find the kth largest element in an unsorted array.",
    approach: "Maintain a min-heap of size k while scanning the array. Any element smaller than the heap's minimum once it's full can't be in the top k, so discard it; the root ends up being the kth largest.",
    complexity: "O(n log k) time, O(k) space",
    code: `function findKthLargest(nums, k) {
  // Using array.sort for clarity; in an interview, implement a real heap for O(n log k).
  return nums.slice().sort((a, b) => b - a)[k - 1];
}`
  },
  {
    title: "Longest Increasing Subsequence",
    category: "Dynamic Programming",
    difficulty: "Hard",
    companies: ["Google", "Microsoft"],
    prompt: "Given an integer array, find the length of the longest strictly increasing subsequence.",
    approach: "Maintain an array 'tails' where tails[l] is the smallest possible tail value of an increasing subsequence of length l+1. For each number, binary search tails for where it belongs and replace or extend.",
    complexity: "O(n log n) time, O(n) space",
    code: `function lengthOfLIS(nums) {
  const tails = [];
  for (const n of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < n) lo = mid + 1; else hi = mid;
    }
    tails[lo] = n;
  }
  return tails.length;
}`
  },
  {
    title: "Clone Graph",
    category: "Graphs",
    difficulty: "Medium",
    companies: ["Google", "Meta", "Amazon"],
    prompt: "Given a node in a connected undirected graph, return a deep copy of the entire graph.",
    approach: "DFS (or BFS) from the given node, using a hash map from original node to cloned node to avoid infinite loops on cycles and to reuse already-cloned nodes.",
    complexity: "O(V + E) time and space",
    code: `function cloneGraph(node) {
  if (!node) return null;
  const visited = new Map();
  function dfs(n) {
    if (visited.has(n)) return visited.get(n);
    const copy = { val: n.val, neighbors: [] };
    visited.set(n, copy);
    for (const nb of n.neighbors) copy.neighbors.push(dfs(nb));
    return copy;
  }
  return dfs(node);
}`
  },
  {
    title: "Trapping Rain Water",
    category: "Arrays / Two Pointers",
    difficulty: "Hard",
    companies: ["Google", "Amazon", "Meta"],
    prompt: "Given an elevation map, compute how much rainwater it can trap after raining.",
    approach: "Water above any bar is limited by the shorter of the tallest bar to its left and the tallest to its right. Two pointers moving inward let you track running left/right maxes in a single O(n) pass instead of precomputing both arrays.",
    complexity: "O(n) time, O(1) space",
    code: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`
  },
  {
    title: "Median of Two Sorted Arrays",
    category: "Binary Search",
    difficulty: "Hard",
    companies: ["Google", "Microsoft", "Apple"],
    prompt: "Given two sorted arrays, find the median of the combined array in O(log(min(m, n))) time.",
    approach: "Binary search a partition point in the smaller array; the partition in the larger array is determined by it. Adjust the partition until the max of the left halves is <= the min of the right halves for both arrays.",
    complexity: "O(log(min(m, n))) time, O(1) space",
    code: `function findMedianSortedArrays(A, B) {
  if (A.length > B.length) [A, B] = [B, A];
  const m = A.length, n = B.length;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1;
    const j = ((m + n + 1) >> 1) - i;
    const aLeft = i === 0 ? -Infinity : A[i - 1];
    const aRight = i === m ? Infinity : A[i];
    const bLeft = j === 0 ? -Infinity : B[j - 1];
    const bRight = j === n ? Infinity : B[j];
    if (aLeft <= bRight && bLeft <= aRight) {
      if ((m + n) % 2 === 0) return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
      return Math.max(aLeft, bLeft);
    } else if (aLeft > bRight) hi = i - 1;
    else lo = i + 1;
  }
  return -1;
}`
  },
  {
    title: "Rotate Image",
    category: "Arrays / Matrix",
    difficulty: "Medium",
    companies: ["Amazon", "Microsoft", "Apple"],
    prompt: "Rotate an n x n matrix 90 degrees clockwise, in place.",
    approach: "Transpose the matrix (swap rows and columns), then reverse each row. Both operations are in-place and their combination is exactly a 90-degree clockwise rotation.",
    complexity: "O(n\u00b2) time, O(1) space",
    code: `function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (const row of matrix) row.reverse();
}`
  },
  {
    title: "Find Median from Data Stream",
    category: "Heaps / Design",
    difficulty: "Hard",
    companies: ["Google", "Amazon"],
    prompt: "Design a structure that supports adding numbers one at a time and finding the median of all numbers added so far, efficiently.",
    approach: "Maintain a max-heap for the lower half of numbers and a min-heap for the upper half, keeping their sizes balanced (differing by at most 1). The median is either the top of the larger heap, or the average of both tops.",
    complexity: "O(log n) per insert, O(1) per median query",
    code: `class MedianFinder {
  constructor() { this.small = []; this.large = []; } // simplified with sorted arrays
  addNum(num) {
    this.small.push(num); this.small.sort((a, b) => b - a);
    this.large.push(this.small.shift()); this.large.sort((a, b) => a - b);
    if (this.large.length > this.small.length + 1) this.small.push(this.large.shift());
  }
  findMedian() {
    if (this.small.length > this.large.length) return this.small[0];
    return (this.small[0] + this.large[0]) / 2;
  }
}`
  },
  {
    title: "Word Ladder",
    category: "Graphs / BFS",
    difficulty: "Hard",
    companies: ["Google", "Amazon", "Meta"],
    prompt: "Given a start word, an end word, and a dictionary, find the length of the shortest transformation sequence changing one letter at a time, where each intermediate word must be in the dictionary.",
    approach: "Model each word as a graph node connected to every word one letter apart. BFS from the start word gives the shortest path length, since BFS explores in order of increasing distance.",
    complexity: "O(n \u00d7 26 \u00d7 wordLength\u00b2) time in the naive form, O(n) space",
    code: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  let queue = [[beginWord, 1]];
  const visited = new Set([beginWord]);
  while (queue.length) {
    const [word, steps] = queue.shift();
    if (word === endWord) return steps;
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (words.has(next) && !visited.has(next)) {
          visited.add(next);
          queue.push([next, steps + 1]);
        }
      }
    }
  }
  return 0;
}`
  }
];

/* ============================================================
   PRACTICE PROBLEMS — for the interactive code terminal
   Each has a starter function signature and hidden test cases.
   ============================================================ */
const PRACTICE_PROBLEMS = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Beginner",
    tags: ["Arrays", "Hash Map"],
    functionName: "twoSum",
    desc: "Write a function <code>twoSum(nums, target)</code> that returns the indices of the two numbers in <code>nums</code> that add up to <code>target</code>. Return them as an array <code>[i, j]</code> with i &lt; j.",
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]" },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" }
    ],
    starter: `function twoSum(nums, target) {
  // your code here

}`,
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] }
    ]
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "Beginner",
    tags: ["Strings", "Two Pointers"],
    functionName: "reverseString",
    desc: "Write a function <code>reverseString(s)</code> that returns the string <code>s</code> reversed.",
    examples: [
      { input: 's = "hello"', output: '"olleh"' },
      { input: 's = "algo"', output: '"ogla"' }
    ],
    starter: `function reverseString(s) {
  // your code here

}`,
    tests: [
      { args: ["hello"], expected: "olleh" },
      { args: ["algo"], expected: "ogla" },
      { args: [""], expected: "" }
    ]
  },
  {
    id: "valid-parens",
    title: "Valid Parentheses",
    difficulty: "Beginner",
    tags: ["Stacks"],
    functionName: "isValid",
    desc: "Write a function <code>isValid(s)</code> that returns <code>true</code> if the brackets in <code>s</code> (using <code>()[]{}</code>) are balanced and properly nested.",
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ],
    starter: `function isValid(s) {
  // your code here

}`,
    tests: [
      { args: ["()[]{}"], expected: true },
      { args: ["(]"], expected: false },
      { args: ["([{}])"], expected: true },
      { args: ["("], expected: false }
    ]
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray",
    difficulty: "Intermediate",
    tags: ["Arrays", "DP"],
    functionName: "maxSubArray",
    desc: "Write a function <code>maxSubArray(nums)</code> that returns the largest possible sum of a contiguous subarray (Kadane's algorithm).",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "nums = [1]", output: "1" }
    ],
    starter: `function maxSubArray(nums) {
  // your code here

}`,
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 }
    ]
  },
  {
    id: "reverse-list",
    title: "Reverse a Linked List (as array)",
    difficulty: "Intermediate",
    tags: ["Linked Lists"],
    functionName: "reverseArrayList",
    desc: "Simulate reversing a singly linked list by writing <code>reverseArrayList(arr)</code> that returns a new array with the elements in reverse order, without using <code>.reverse()</code>.",
    examples: [
      { input: "arr = [1,2,3,4]", output: "[4,3,2,1]" }
    ],
    starter: `function reverseArrayList(arr) {
  // your code here -- don't use Array.prototype.reverse()

}`,
    tests: [
      { args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1] },
      { args: [[1]], expected: [1] },
      { args: [[]], expected: [] }
    ]
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Intermediate",
    tags: ["Searching"],
    functionName: "search",
    desc: "Write a function <code>search(nums, target)</code> that returns the index of <code>target</code> in the sorted array <code>nums</code>, or <code>-1</code> if not found, in O(log n).",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }
    ],
    starter: `function search(nums, target) {
  // your code here

}`,
    tests: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[5], 5], expected: 0 }
    ]
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Expert",
    tags: ["Dynamic Programming"],
    functionName: "coinChange",
    desc: "Write a function <code>coinChange(coins, amount)</code> that returns the fewest number of coins needed to make up <code>amount</code>, or <code>-1</code> if it's not possible.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3" },
      { input: "coins = [2], amount = 3", output: "-1" }
    ],
    starter: `function coinChange(coins, amount) {
  // your code here

}`,
    tests: [
      { args: [[1, 2, 5], 11], expected: 3 },
      { args: [[2], 3], expected: -1 },
      { args: [[1], 0], expected: 0 }
    ]
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Expert",
    tags: ["Graphs", "DFS"],
    functionName: "numIslands",
    desc: "Write a function <code>numIslands(grid)</code> where <code>grid</code> is a 2D array of <code>'1'</code> (land) and <code>'0'</code> (water) strings. Return the number of islands (connected groups of land, horizontally/vertically adjacent).",
    examples: [
      { input: '[["1","1","0"],["0","1","0"],["0","0","1"]]', output: "2" }
    ],
    starter: `function numIslands(grid) {
  // your code here

}`,
    tests: [
      { args: [[["1", "1", "0"], ["0", "1", "0"], ["0", "0", "1"]]], expected: 2 },
      { args: [[["1", "0"], ["0", "1"]]], expected: 2 },
      { args: [[["1", "1"], ["1", "1"]]], expected: 1 }
    ]
  }
];
