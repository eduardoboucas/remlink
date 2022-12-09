#!/usr/bin/env node
import { linkModules } from "./main.js";

linkModules().catch(console.error);
