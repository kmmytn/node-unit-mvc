const sinon = require('sinon');
const PostModel = require('../models/post.model');
const PostController = require('../controllers/post.controller');

describe('Post controller', () => {
    // Setup the responses
    let req = {
        body: {
            author: 'stswenguser',
            title: 'My first test post',
            content: 'Random content'
        }
    };

    let error = new Error({ error: 'Some error message' });

    let res = {};

    let expectedResult;

    
    describe('create', () => {
        var createPostStub;

        beforeEach(() => {
            // before every test case setup first
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });

        afterEach(() => {
            // executed after the test case
            createPostStub.restore();
        });


        it('should return the created post object', () => {
            // Arrange
            expectedResult = {
                _id: '507asdghajsdhjgasd',
                title: 'My first test post',
                content: 'Random content',
                author: 'stswenguser',
                date: Date.now()
            };

            createPostStub = sinon.stub(PostModel, 'createPost').yields(null, expectedResult);

            // Act
            PostController.create(req, res);

            // Assert
            sinon.assert.calledWith(PostModel.createPost, req.body);
            sinon.assert.calledWith(res.json, sinon.match({ title: req.body.title }));
            sinon.assert.calledWith(res.json, sinon.match({ content: req.body.content }));
            sinon.assert.calledWith(res.json, sinon.match({ author: req.body.author }));

        });


        // Error Scenario
        it('should return status 500 on server error', () => {
            // Arrange
            createPostStub = sinon.stub(PostModel, 'createPost').yields(error);

            // Act
            PostController.create(req, res);

            // Assert
            sinon.assert.calledWith(PostModel.createPost, req.body);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });


    describe('update', () => {
        let updatePostStub;

       beforeEach(() => {
           // Reset the response object before each test
           res = {
               json: sinon.spy(),
               status: sinon.stub().returns({ end: sinon.spy() })
           };
       });

       afterEach(() => {
           // Restore the stub after each test
           updatePostStub.restore();
       });

       it('should return updated post object', async () => {
           // Arrange
           const postId = '1234';
           const updateData = {
               title: 'Updated Title',
               content: 'Updated Content'
           };
           req.params = { id: postId };
           req.body = updateData;
           const updatedPost = {
               _id: postId,
               ...updateData,
               author: 'stswenguser',
               date: Date.now()
           };

           updatePostStub = sinon.stub(PostModel, 'updatePost').yields(null, updatedPost);

           // Act
           await PostController.update(req, res);

           // Assert
           sinon.assert.calledWith(updatePostStub, postId, updateData);
           sinon.assert.calledWith(res.json, sinon.match(updatedPost));
       });

       it('should return status 500 on server error', async () => {
           // Arrange
           const postId = '1234';
           req.params = { id: postId };
           req.body = { title: 'Updated Title' };

           updatePostStub = sinon.stub(PostModel, 'updatePost').yields(error);

           // Act
           await PostController.update(req, res);

           // Assert
           sinon.assert.calledWith(PostModel.updatePost, postId, req.body);
           sinon.assert.calledWith(res.status,  500);
           sinon.assert.calledOnce(res.status(500).end);
       });
      
   });
    

   describe('findPost', () => {
    let findPostStub;
    let postId;
    let expectedPost;

    beforeEach(() => {
        // Reset the request and response objects before each test
        req = {
            params: {}
        };
        res = {
            json: sinon.spy(),
            status: sinon.stub().returns({ end: sinon.spy() })
        };
    });

    afterEach(() => {
        // Restore the stub after each test
        findPostStub.restore();
    });

    it('should return the found post object', async () => {
        // Arrange
        postId = '1234';
        req.params.id = postId;
        expectedPost = {
            _id: postId,
            title: 'Found Post',
            content: 'Content of the found post',
            author: 'testuser',
            date: Date.now()
        };
        findPostStub = sinon.stub(PostModel, 'findPost').resolves(expectedPost);

        // Act
        await PostController.findPost(req, res);

        // Assert
        sinon.assert.calledWith(findPostStub, postId);
        sinon.assert.calledWith(res.json, sinon.match(expectedPost));
    });

    it('should return status  500 on server error', async () => {
        // Arrange
        postId = '1234';
        req.params.id = postId;
        findPostStub = sinon.stub(PostModel, 'findPost').rejects(error);

        // Act
        await PostController.findPost(req, res);

        // Assert
        sinon.assert.calledWith(findPostStub, postId);
        sinon.assert.calledWith(res.status,  500);
        sinon.assert.calledOnce(res.status(500).end);
    });
});
});