import Vue from 'vue'
import Settings from '../../components/Settings'
import { mount } from '@vue/test-utils'
import sinon from 'sinon'

import Vuetify from 'vuetify';
Vue.use(Vuetify);

const mockUserData = {
	information: {
		bio: "A dude",
		bitcoin: "1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX",
		ethereum: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
		linkedin: "",
		litecoin: "",
		name: "Niko",
		phone: "0412345678",
		surname: ""
	},
	settings: {
		sound: true
	}
}

const mockUid = "abcd1234"

const mockUpdate = sinon.spy();

jest.mock('firebase', () => {
	return {
		auth: () => {
			return { 
				currentUser: {uid: mockUid} 
			}
		},
		database: () => {
			return {
				ref: (dbRef) => {
					return { 
						once: (type, callback) => {
							let returnedValue = {};

							if (dbRef === `users/${mockUid}`) {
								returnedValue = mockUserData
							} 

							callback({
								val: () => returnedValue
							})
						},
						update: mockUpdate
					}	
				}
			}
		}
	}
});

describe('Settings.vue', () => {
	const wrapper = mount(Settings)

	it('should attach the uid from firebase to component data', () => {
		expect(wrapper.vm.$data.userUid).toEqual(mockUid)
	})

	it('should attach the userData from firebase to the component data', () => {
		expect(wrapper.vm.$data.stagedInfo).toEqual(mockUserData.information)
	})


	it('saveInformation method should write data.stagedInfo to firebase', () => {
		Vue.set(wrapper.vm, 'stagedInfo', {'stubdata': true})

		wrapper.vm.saveInformation()

		expect(mockUpdate.calledWith({'stubdata': true})).toEqual(true)
	})	
})
