import {
	PropsWithChildren,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function InfoComponent({ children }: PropsWithChildren<{}>) {
	return (
		<>
			<div className="flex space-x-1">
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img
						src={reactLogo}
						className="logo react"
						alt="React logo"
					/>
				</a>
			</div>

			<h1 className="text-white">Vite + React: {children}</h1>
		</>
	)
}
async function SomeWork() {
	return new Promise((resolve) => setTimeout(resolve, 1000))
}

function ProblemState() {
	const [step, setStep] = useState(0)

	const kickOffWork = async () => {
		try {
			console.log('State referece', step)
			for (let i = 0; i < 5; i++) {
				if (i < step) {
					console.log('skipping:', i)
					continue
				}

				await SomeWork()

				// could error on 0, 2 & 4
				if (Math.random() < 0.5 && i % 2 == 0) {
					console.log('Current index', i)
					console.log('Current step', step)
					throw new Error('Some error')
				}

				// setStep((prev) => prev + 1)
				setStep(i + 1)
				console.log('Worked up to...', i + 1)
			}
		} catch (error) {
			console.error(error)
			const confirm = window.confirm('Error occurred')
			if (confirm) {
				kickOffWork()
			}
		}
	}
	return (
		<>
			<div className="min-h-svh bg-sky-950 p-4 font-mono">
				<InfoComponent>The problem</InfoComponent>

				<div className="mt-5">
					<button
						onClick={kickOffWork}
						className="rounded bg-blue-600 px-3 py-2 text-white"
					>
						Click me
					</button>
				</div>
				<p className="mt-2 text-white">Current Step {step}</p>
			</div>
		</>
	)
}

// Solution 1: Using a ref
function Solution1() {
	const stepRef = useRef(0)

	const kickOffWork = async () => {
		try {
			for (let i = 0; i < 5; i++) {
				if (i < stepRef.current) {
					console.log('skipping:', i)
					continue
				}

				await SomeWork()

				if (Math.random() < 0.5 && i % 2 == 0) {
					console.log('Current index', i)
					console.log('Current step', stepRef.current)
					throw new Error('Some error')
				}

				stepRef.current = i + 1

				console.log('Worked up to...', stepRef.current)
			}
		} catch (error) {
			console.error(error)
			const confirm = window.confirm('Error occurred')
			if (confirm) {
				kickOffWork()
			}
		}
	}
	return (
		<>
			<div className="min-h-svh bg-sky-950 p-4 font-mono">
				<InfoComponent>Ref-ing it</InfoComponent>

				<div className="mt-5">
					<button
						onClick={kickOffWork}
						className="rounded bg-blue-600 px-3 py-2 text-white"
					>
						Click me
					</button>
				</div>
				<p className="mt-2 text-white">
					Current Step {stepRef.current}
				</p>
			</div>
		</>
	)
}

// Solution 2: Embrace a modal outside the component
function Solution2() {
	const [step, setStep] = useState(0)
	const [confirmModal, setConfirmModal] = useState(false)

	const kickOffWork = useCallback(async () => {
		try {
			console.log('State referece', step)
			for (let i = 0; i < 5; i++) {
				if (i < step) {
					console.log('skipping:', i)
					continue
				}

				await SomeWork()

				// could error on 0, 2 & 4
				if (Math.random() < 0.5 && i % 2 == 0) {
					console.log('Current index', i)
					console.log('Current step', step)
					throw new Error('Some error')
				}

				// setStep((prev) => prev + 1)
				setStep(i + 1)

				console.log('Worked up to...', i + 1)
			}
		} catch (error) {
			console.error(error)
			setConfirmModal(true)
		}
	}, [step])

	useEffect(() => {
		if (confirmModal) {
			const confirm = window.confirm('Error occurred')
			if (confirm) {
				setConfirmModal(false)
				kickOffWork()
			}
		}
	}, [confirmModal])
	return (
		<>
			<div className="min-h-svh bg-sky-950 p-4 font-mono">
				<InfoComponent>
					Solution 2 - Modal/Confirm outside the function call
				</InfoComponent>

				<div className="mt-5">
					<button
						onClick={kickOffWork}
						className="rounded bg-blue-600 px-3 py-2 text-white"
					>
						Click me
					</button>
				</div>
				<p className="mt-2 text-white">Current Step {step}</p>
			</div>
		</>
	)
}
import { create } from 'zustand'

const useStore = create<{ step: number; work: () => void }>((set, get) => ({
	step: 0,
	work: async () => {
		console.log('State referece', get().step)
		for (let i = 0; i < 5; i++) {
			if (i < get().step) {
				console.log('skipping:', i)
				continue
			}

			await SomeWork()

			// could error on 0, 2 & 4
			if (Math.random() < 0.5 && i % 2 == 0) {
				console.log('Current index', i)
				console.log('Current step', get().step)
				throw new Error('Some error')
			}

			set((state) => ({ step: state.step + 1 }))

			console.log('Worked up to...', i + 1)
		}
	},
}))

// Solution 3: Use a global state
function Solution3() {
	const { step, work } = useStore()

	const kickOffWork = async () => {
		try {
			await work()
		} catch (error) {
			console.error(error)
			const confirm = window.confirm('Error occurred')
			if (confirm) {
				kickOffWork()
			}
		}
	}

	return (
		<>
			<div className="min-h-svh bg-sky-950 p-4 font-mono">
				<InfoComponent>Solution 3 - Global state is cool</InfoComponent>

				<div className="mt-5">
					<button
						onClick={kickOffWork}
						className="rounded bg-blue-600 px-3 py-2 text-white"
					>
						Click me
					</button>
				</div>
				<p className="mt-2 text-white">Current Step {step}</p>
			</div>
		</>
	)
}

// ProblemState | Solution1 | Solution2 | Solution3
export default ProblemState
