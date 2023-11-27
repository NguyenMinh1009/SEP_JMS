using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Tests.Repositories
{
    [TestFixture]
    public class UserRepositoryTests
    {
        IUserRepository _userRepository;
        List<User> testUsers;
        readonly int _adminCount = 4;

        [SetUp]
        public async Task Setup()
        {
            
            _userRepository = ContextGenerator.GetRepository<UserRepository, User>();
            testUsers = new List<User>();

            // clear all before tests
            ContextGenerator.Instance.Users.RemoveRange(ContextGenerator.Instance.Users);
            await ContextGenerator.Instance.SaveChangesAsync();

            // Add new Users
            for (int i = 0; i < 10; i++) {
                var testUser = new User();
                testUser.UserId = Guid.NewGuid();
                testUser.Username = "user_demo_" + i;
                testUser.Password = "password";
                testUser.Fullname = "Account Demo " + i;
                testUser.Gender = Model.Enums.System.Gender.Male;
                testUser.HiddenPrice = true;
                testUser.CreatedTime = 0;
                testUser.AccountStatus = Model.Enums.System.AccountStatus.Active;
                testUser.RoleType = i < _adminCount ? Model.Enums.System.RoleType.Admin : Model.Enums.System.RoleType.Customer;
                testUsers.Add(testUser);
                await _userRepository.AddUser(testUser);
            }
        }

        [Test]
        public async Task IsValidUsername_ShouldReturnFalse() 
        { 
            Assert.IsFalse(await _userRepository.IsValidUsername(testUsers[0].Username));
        }

        [Test]
        public async Task Login_WithCorrectInfo_ShouldReturnNotNull()
        {
            // login
            var user = await _userRepository.Login(new Model.Api.Request.User.UserLoginRequest { Username = testUsers[0].Username, Password = testUsers[0].Password });
            Assert.IsNotNull(user);
        }

        [Test]
        public async Task GetUsers_WithAdminRole_ShouldReturn4()
        {
            var results = await _userRepository.GetUsers(new Model.Api.Request.User.UserFilterRequest { PageIndex = 1 , PageSize = 10, Role = Model.Enums.System.RoleType.Admin, SearchText = ""});
            Assert.That(results.Count, Is.EqualTo(_adminCount));
        }

        [Test]
        public async Task GetUsers_WithSearchText_ShouldReturnCorrect()
        {
            var results = await _userRepository.GetUsers(new Model.Api.Request.User.UserFilterRequest { PageIndex = 1, PageSize = 10, Role = Model.Enums.System.RoleType.Admin, SearchText = "demo_1" });
            Assert.That(results.Count, Is.EqualTo(1));

        }
        
        [Test]
        public async Task FindUsers_WithSearchText_ShouldReturnCorrect()
        {
            var results = await _userRepository.FindUsers(new Model.Api.Request.GetUsersRequestModel { PageIndex = 1, PageSize = 10, Role = Model.Enums.System.RoleType.Customer, SearchText = "Demo"});
            Assert.That(results.Items.Count, Is.EqualTo(6));

        }
    }
}
