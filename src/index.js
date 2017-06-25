if (!global._babelPolyfill) { require('babel-polyfill'); }

import { _, queryJson, responseFind, responseGet, queryDelete, definitionParser } from './utils';
import errors from 'feathers-errors';
import Solr from './client/solr';
import makeDebug from 'debug';

const debug = makeDebug('feathers-solr');

class Service {

	constructor(opt = {}) {

		this.options = Object.assign({},{
			conn: {
				scheme: 'http',
				host: 'localhost',
				port: 8983,
				path: '/solr',
				core: '/gettingstarted'
			},
			schema: false,
			managedScheme: false,
			/*commitStrategy softCommit: true, commit: true, commitWithin: 50*/
			commitStrategy: {
				softCommit: true,
				commitWithin: 50000,
				overwrite: true
			}
		},opt);

		this.Solr = new Solr({
			scheme: this.options.conn.scheme,
			host: this.options.conn.host,
			port: this.options.conn.port,
			path: this.options.conn.path,
			core: this.options.conn.core,
			managedScheme: this.options.conn.managedScheme,
			commitStrategy: this.options.commitStrategy
		});

		console.log('feather-solr Service started',this.options.commitStrategy || {
			softCommit: true,
			commitWithin: 50000,
			overwrite: true
		});

		if (this.options.schema !== false) {
			this.define(this.options.schema);

		}
	}

	status() {
		let coreAdmin = this.Solr.coreAdmin();
		coreAdmin.status()
			.then(function(res) {
				console.log('core status',res);
			})
			.catch(function(err){
				console.error(err);
				// return reject(new errors.BadRequest());
			});
	}

	define(fields) {
		let schemaApi = this.Solr.schema();
		this.options.schema = fields;
		schemaApi.addField(definitionParser('add', fields))
			.then(function(res) {
				console.log('schemaApi.addField',res.errors);
			})
			.catch(function(err){
				console.error(err);
			});
	}

	describe() {
		let schemaApi = this.Solr.schema();
		schemaApi.fields()
			.then(function(res) {
				console.log('schemaApi.fields',res.fields);
			})
			.catch(function(err){
				console.error(err);
			});
	}


	find(params) {
		let _self = this;
		debug('Service.find',params);
		return new Promise((resolve, reject) => {
			this.Solr.json(queryJson(params, _self.options))
				.then(function(res) {
					resolve(responseFind(params, _self.options, res));
				})
				.catch(function(err) {
                    debug('Service.find ERROR:',err);
					return reject(new errors.BadRequest());
				});
		});
	}

	get(id) {
		let _self = this;
		debug('Service.get(id)',id);
		// console.log(queryJson({query:{id: id}}),'get ????');
		return new Promise((resolve, reject) => {
			this.Solr.json(queryJson({ query: { id: id } }))
				.then(function(res) {
					let docs = responseGet(res);
					// console.log('docs',docs);
					if (typeof docs !== 'undefined') {
						return resolve(docs);
					} else {
						return reject(new errors.NotFound(`No record found for id '${id}'`));
					}
				})
				.catch(function(err) {
					console.log('err', err);
					return reject(new errors.NotFound(`No record found for id '${id}'`));
				});
		});
	}

	create(data) {

		let _self = this;

		return new Promise((resolve, reject) => {
			this.Solr.update(data)
				.then(function(res) {
					if (res.responseHeader.status === 0) {
						resolve(data);
					} else {
						return reject(new errors.BadRequest());
					}
				})
				.catch(function(err) {
					return reject(new errors.BadRequest());
				});
		});
	}

	/**
	 * adapter.update(id, data, params) -> Promise
	 * @param  {[type]} id     [description]
	 * @param  {[type]} data   [description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	update(id, data) {

		if (id === null || Array.isArray(data)) {
			return Promise.reject(new errors.BadRequest(
				`You can not replace multiple instances. Did you mean 'patch'?`
			));
		}

		let _self = this;
		data.id = id;

		return new Promise((resolve, reject) => {
			_self.create(data)
				.then(function(res) {
					resolve(data);
				})
				.catch(function(err) {
					return reject(new errors.BadRequest());
				});
		});
	}

	/**
	 * adapter.patch(id, data, params) -> Promise
	 * @param  {[type]} id     [description]
	 * @param  {[type]} data   [description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	patch(id, data, params) {

		let _self = this;

		return new Promise((resolve, reject) => {
			this.Solr.json(queryJson({ query: { id: id, $limit: 1 } }, this.options))
				.then(function(res) {
					res = responseGet(res);
					data.id = id;
					let copy = {};

					Object.keys(res).forEach(key => {
						if (typeof data[key] === 'undefined') {
							copy[key] = null;
						} else {
							copy[key] = data[key];
						}
					});
					_self.create(copy)
						.then(function(res) {
							resolve(copy);
						})
						.catch(function(err) {
							return reject(new errors.BadRequest());
						});
				})
				.catch(function(err) {
					console.log('err', err);
					return reject(new errors.BadRequest());
				});
		});

	}

	remove(id, params) {
		// console.log('id, params',id, params);
		let _self = this;

		return new Promise((resolve, reject) => {
			this.Solr.delete(queryDelete(id, params))
				.then(function(res) {
					resolve(res);
				})
				.catch(function(err) {
					return reject(new errors.BadRequest());
				});
		});
	}

	client() {
		return this.Solr;
	}
}

export default function init(options) {
	debug('Initializing feathers-solr plugin');
	console.log('Initializing feathers-solr plugin', options);
	return new Service(options);
}

init.Service = Service;
