/**
 * CSVをタイムライン用HTMLに変換する
 *
 * @see https://docs.google.com/spreadsheets/d/1sxR7dBQmKtmjtH-OFP8SHUvJOUjyGBsmN_hbKpLay0E/edit#gid=0
 */
const csv = require( 'csvtojson' )
const fs = require( 'fs' ).promises
const pug = require( 'pug' );

csv()
	.fromFile( 'history.csv' )
	.then( ( jsonObj ) => {
		const data = jsonObj.map( ( item ) => {
			const date = item[ '年' ] + '-' + ( '0' + item[ '月' ] ).slice( -2 ) + '-01';
			const body = [
				{
					tag: 'p',
					content: item[ '出来事' ],
					attr: {
						cssclass: {
							'WordPress': 'wordpress',
							'周辺技術': 'tech',
							'世の中': 'society',
							'ホスティング': 'hosting',
							'さくらインターネット': 'sakura',
						}[item[ 'カテゴリー' ]],
					}

				}
			];
			if ( item.URL ) {
				body.push( {
					tag: 'a',
					content: "リンク",
					attr: {
						href: item.URL,
						cssclass: 'link',
					}
				} );
			}
			return {
				time: date + ' 00:00:00',
				body,
				header: item[ 'カテゴリー' ],
			};
		} );
		return fs.writeFile( 'dist/history.js', 'var graphData = ' + JSON.stringify( data, null, 4 ) + ';' );
	} )
	.then( () => {
		return fs.writeFile( 'dist/index.html', pug.renderFile( 'index.pug' ) );
	} )
	.then( () => console.log( 'HTMLを保存しました。' ) );
