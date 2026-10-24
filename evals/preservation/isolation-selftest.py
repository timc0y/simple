#!/usr/bin/env python3
"""Offline contract checks: fixtures need no native sandbox; model paths still do."""
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest import TestCase, main
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
spec = spec_from_file_location("preservation_under_test", ROOT / "evals/preservation/run.py")
preservation = module_from_spec(spec)
spec.loader.exec_module(preservation)


class IsolationContract(TestCase):
    def setUp(self):
        self.scratch = TemporaryDirectory(prefix="simple-isolation-")
        self.addCleanup(self.scratch.cleanup)
        self.record_patch = patch.object(preservation, "RECORD", Path(self.scratch.name) / "record")
        self.record_patch.start()
        self.addCleanup(self.record_patch.stop)
        self.commands = patch.object(preservation.subprocess, "run", return_value=SimpleNamespace(returncode=0, stdout="", stderr=""))
        self.run_mock = self.commands.start()
        self.addCleanup(self.commands.stop)
        self.canary_patch = patch.object(preservation.base, "canary", side_effect=RuntimeError("isolation refused"))
        self.canary = self.canary_patch.start()
        self.addCleanup(self.canary_patch.stop)

    def test_offline_fixture_check_does_not_claim_native_isolation(self):
        preservation.selftest()
        self.canary.assert_not_called()
        self.assertFalse(preservation.RECORD.exists())
        self.assertIs(preservation.base.selftest, preservation.isolated_selftest)
        self.assertFalse(any("codex" in str(call) for call in self.run_mock.call_args_list))

    def test_preregister_refuses_failed_isolation(self):
        with self.assertRaisesRegex(RuntimeError, "isolation refused"):
            preservation.preregister()
        self.canary.assert_called_once()

    def test_measure_and_resume_refuse_failed_isolation(self):
        with self.assertRaisesRegex(RuntimeError, "isolation refused"):
            preservation.measure()
        self.canary.assert_called_once()

    def test_native_preflight_keeps_the_canary_before_model_calls(self):
        preservation.selftest()
        with self.assertRaisesRegex(RuntimeError, "isolation refused"):
            preservation.base.preflight()
        self.canary.assert_called_once()
        self.assertFalse(any("codex" in str(call) for call in self.run_mock.call_args_list))


if __name__ == "__main__":
    main()
