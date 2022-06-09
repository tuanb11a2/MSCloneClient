export default ({ store }, inject) => {
	inject('loadingPage', {
		open() {
			store.dispatch('setLoadingStatus', true)
		},
		close() {
			store.dispatch('setLoadingStatus', false)
		}
	})
}