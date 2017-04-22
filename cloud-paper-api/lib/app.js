import Express from 'express'
import router from '../api_router'
let app = Express();
app.use('/', router);

app.listen(4000, () => {
	console.log('Server listening at http://localhost:4000');
});
