import { MotionButton } from "project-sphere-design-kit";

export function Primary() {
  return <MotionButton variant="primary">Publish project</MotionButton>;
}

export function Secondary() {
  return <MotionButton variant="secondary">Save draft</MotionButton>;
}

export function Ghost() {
  return <MotionButton variant="ghost">Cancel</MotionButton>;
}
