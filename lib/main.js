"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
function uploadAddon(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = Buffer.from(`${params.username}:${params.password}`).toString('base64');
        const data = new form_data_1.default();
        data.append('slug', params.slug);
        data.append('xpiUpload', fs_1.default.createReadStream(params.xpi));
        const response = yield axios_1.default.post(`https://addons.palemoon.org/panel/addons/?task=update&what=release&slug=${params.slug}`, data, {
            headers: Object.assign({ Authorization: `Basic ${token}` }, data.getHeaders())
        });
        if (response.data) {
            const matches = response.data.match(/<h2>Unable\sto\sComply<\/h2><ul><li>(.+?)<\/li><ul>/);
            if (matches) {
                throw new Error(`${response.statusText}: ${matches[1]}`);
            }
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const slug = core.getInput('slug', { required: true });
            const xpi = core.getInput('xpi', { required: true });
            const username = core.getInput('username', { required: true });
            const password = core.getInput('password', { required: true });
            yield uploadAddon({ slug, xpi, username, password });
            core.debug('Uploaded addon');
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
