import os
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()


class SimpleAgent:
    """
    Simple multi-step agent with sandboxed execution
    
    This agent breaks down tasks into steps and executes them safely
    without external API calls or file system access.
    """
    
    def __init__(self):
        self.max_steps = int(os.getenv("AGENT_MAX_STEPS", 5))
        self.enabled = os.getenv("AGENT_ENABLED", "false").lower() == "true"
    
    async def execute(self, task: str) -> Dict[str, Any]:
        """
        Execute a task by breaking it down into steps
        
        Args:
            task: Task description
        
        Returns:
            Dict with steps and status
        """
        if not self.enabled:
            return {
                "steps": [{
                    "step": 1,
                    "action": "Agent Disabled",
                    "result": "Agent is disabled. Enable it in .env by setting AGENT_ENABLED=true"
                }],
                "status": "disabled"
            }
        
        # Decompose task into steps (simplified for demo)
        steps = self._decompose_task(task)
        
        # Execute each step
        results = []
        for i, step_desc in enumerate(steps, 1):
            result = await self._execute_step(step_desc, i)
            results.append(result)
            
            if result.get("error"):
                break
        
        return {
            "steps": results,
            "status": "completed" if not any(s.get("error") for s in results) else "error"
        }
    
    def _decompose_task(self, task: str) -> List[str]:
        """
        Decompose task into steps (simplified heuristic)
        
        In production, this would use an LLM to intelligently break down tasks
        """
        task_lower = task.lower()
        
        if "analyze" in task_lower or "architecture" in task_lower:
            return [
                "Identify key components",
                "Analyze component relationships",
                "Document findings",
                "Generate summary"
            ]
        elif "list" in task_lower or "features" in task_lower:
            return [
                "Scan project structure",
                "Extract feature list",
                "Categorize features",
                "Format output"
            ]
        elif "explain" in task_lower or "deployment" in task_lower:
            return [
                "Review deployment configuration",
                "Identify deployment steps",
                "Document prerequisites",
                "Provide instructions"
            ]
        else:
            return [
                "Parse task requirements",
                "Plan execution strategy",
                "Execute core logic",
                "Validate results"
            ]
    
    async def _execute_step(self, step_desc: str, step_num: int) -> Dict[str, Any]:
        """
        Execute a single step (sandboxed, no external calls)
        
        Args:
            step_desc: Step description
            step_num: Step number
        
        Returns:
            Dict with step info and result
        """
        # Simulate step execution with mock results
        mock_results = {
            "Identify key components": "Found: Frontend (Next.js), Backend (FastAPI), RAG System, Agent",
            "Analyze component relationships": "Frontend → API → Backend → RAG/Agent",
            "Document findings": "System uses microservices architecture with clear separation of concerns",
            "Generate summary": "Complete analysis documented",
            "Scan project structure": "Scanned frontend/, backend/, content/, data/ directories",
            "Extract feature list": "Features: RAG demo, Agent playground, Project gallery, Markdown rendering",
            "Categorize features": "Categories: Core (3), Interactive (2), Content (2)",
            "Format output": "Formatted feature list generated",
            "Review deployment configuration": "Found: Dockerfile, docker-compose.yml, vercel.json",
            "Identify deployment steps": "Steps: 1) Build, 2) Configure env, 3) Deploy",
            "Document prerequisites": "Prerequisites: Node.js 18+, Python 3.11+, API keys",
            "Provide instructions": "Deployment instructions documented",
            "Parse task requirements": "Task requirements parsed successfully",
            "Plan execution strategy": "Execution plan created",
            "Execute core logic": "Core logic executed",
            "Validate results": "Results validated successfully"
        }
        
        result = mock_results.get(
            step_desc,
            f"Executed: {step_desc}"
        )
        
        return {
            "step": step_num,
            "action": step_desc,
            "result": result,
            "status": "completed"
        }
