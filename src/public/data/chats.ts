export const sampleMessages = [
  {
    id: 'msg-1',
    content: 'What are some best practices for React development in 2024?',
    role: 'user',
    timestamp: new Date('2024-01-15T10:30:00')
  },
  {
    id: 'msg-2',
    content: `Here are some key React best practices for 2024:`,
    role: 'assistant',
    timestamp: new Date('2024-01-15T10:32:00')
  },
  {
    id: 'msg-3',
    content: 'Can you explain more about when to use useCallback vs useMemo?',
    role: 'user',
    timestamp: new Date('2024-01-15T10:35:00')
  },
  {
    id: 'msg-4',
    content: `Great question! You should generally use **useCallback** when you want to memoize a function so that it doesn’t get re-created on every render. 
This is especially useful when passing callbacks down to memoized child components, preventing unnecessary re-renders. 
On the other hand, **useMemo** is used to memoize a value — for example, the result of an expensive calculation. 
So in short: useCallback → memoize functions, useMemo → memoize values.`,
    role: 'assistant',
    timestamp: new Date('2024-01-15T10:37:00')
  },
  {
    id: 'msg-5',
    content: `Can you provide an example of an "expensive calculation" where useMemo would actually be useful? 
I sometimes struggle to identify real-world scenarios where it makes sense.`,
    role: 'user',
    timestamp: new Date('2024-01-15T10:40:00')
  },
  {
    id: 'msg-6',
    content: `Absolutely. Imagine you have a component that renders a list of items, and before rendering, you need to filter, sort, or perform some heavy computation on the list. 
If the input list is large and the computation is non-trivial (like searching, sorting, or formatting), running that logic on every render can slow things down.
By wrapping the calculation in **useMemo**, React will only re-run the expensive computation when its dependencies change, rather than on every single render. 

Here’s a simplified code example:

\`\`\`jsx
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.value - b.value);
}, [items]);
\`\`\`

Without useMemo, the sort would run on every render — even if \`items\` hasn’t changed.`,
    role: 'assistant',
    timestamp: new Date('2024-01-15T10:45:00')
  },
  {
    id: 'msg-7',
    content: `That makes sense. So if I understand correctly, it's not always about performance, but about avoiding unnecessary recalculations that could add up when state or props change?`,
    role: 'user',
    timestamp: new Date('2024-01-15T10:48:00')
  },
  {
    id: 'msg-8',
    content: `Exactly! 🚀 You nailed it. 
While you may not notice a big performance difference in smaller apps, in larger applications where components re-render frequently, unnecessary calculations or re-creations of functions can have a cumulative impact. 
Best practice: don’t prematurely optimize — but if you identify re-renders or recalculations that are slowing things down, that’s when useCallback and useMemo shine.`,
    role: 'assistant',
    timestamp: new Date('2024-01-15T10:50:00')
  },
  {
    id: 'msg-9',
    content: `Got it. Thanks! Also, are there any new hooks or React features I should be aware of this year that could improve performance or developer experience?`,
    role: 'user',
    timestamp: new Date('2024-01-15T10:55:00')
  },
  {
    id: 'msg-10',
    content: `Yes — React 18 introduced **concurrent features** like \`useTransition\` and \`useDeferredValue\`, which are particularly helpful for improving UI responsiveness. 
- **useTransition** lets you mark updates as “non-urgent,” so the UI stays snappy while React handles background state updates.
- **useDeferredValue** lets you defer re-rendering expensive parts of the UI until the main updates are done.  

These are becoming more important as applications get more interactive and data-heavy.  
Would you like me to create a sample code snippet showing \`useTransition\` in action?`,
    role: 'assistant',
    timestamp: new Date('2024-01-15T11:00:00')
  }
];
