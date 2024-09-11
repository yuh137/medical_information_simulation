using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO.Auth;
using Medical_Information.API.Repositories.Interfaces;
using Medical_Information.API.Repositories.Interfaces.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace Medical_Information.API.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;
        private readonly IAdminRepository adminRepository;
        private readonly IStudentRepository studentRepository;

        public AuthController(UserManager<IdentityUser> userManager, ITokenRepository tokenRepository, IAdminRepository adminRepository, IStudentRepository studentRepository)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
            this.adminRepository = adminRepository;
            this.studentRepository = studentRepository;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO requestDTO)
        {
            var identityUser = new IdentityUser
            {
                UserName = requestDTO.Username,
                Email = requestDTO.Email,
            };

            var identityResult = await userManager.CreateAsync(identityUser, requestDTO.Password);

            Console.WriteLine(identityResult);

            if (identityResult.Succeeded)
            {
                if (requestDTO.Roles != null && requestDTO.Roles.Any())
                {
                    identityResult = await userManager.AddToRolesAsync(identityUser, requestDTO.Roles);

                    if (identityResult.Succeeded)
                    {
                        if (requestDTO.Roles.Contains("Admin"))
                        {
                            var newUser = new Admin
                            {
                                Username = requestDTO.Username,
                                Email = requestDTO.Email,
                                Firstname = requestDTO.Firstname,
                                Lastname = requestDTO.Lastname,
                                Initials = requestDTO.Initials,
                                Students = new List<Student>()
                            };

                            await adminRepository.CreateAdminAsync(newUser);
                        } else if (requestDTO.Roles.Contains("Student"))
                        {
                            var newUser = new Student
                            {
                                Username = requestDTO.Username,
                                Email = requestDTO.Email,
                                Firstname = requestDTO.Firstname,
                                Lastname = requestDTO.Lastname,
                                Initials = requestDTO.Initials,
                                Admins = new List<Admin>()
                            };

                            await studentRepository.CreateStudentAsync(newUser);
                        }

                        return Ok("User successfully registered");
                    }
                }
            }

            return BadRequest("Something went wrong!");
        }

        [HttpPost]
        [Route("LoginByUsername")]
        public async Task<IActionResult> LoginByUsername([FromBody] LoginByUsernameRequestDTO loginDTO)
        {
            var user = await userManager.FindByNameAsync(loginDTO.Username);

            if (user != null)
            {
                var isPasswordCorrect = await userManager.CheckPasswordAsync(user, loginDTO.Password);

                if (isPasswordCorrect)
                {
                    // Create Token
                    var roles = await userManager.GetRolesAsync(user);

                    if (roles != null && roles.Any())
                    {
                        if (roles.Contains("Admin"))
                        {
                            var savedUser = await adminRepository.GetAdminByNameAsync(loginDTO.Username);

                            if (savedUser != null)
                            {
                                var token = tokenRepository.CreateJWTToken(user, roles.ToList());

                                var response = new LoginResponseDTO
                                {
                                    JwtToken = token,
                                    UserID = savedUser.AdminID,
                                    Roles = roles.ToList(),
                                };

                                var cookieOptions = new CookieOptions
                                {
                                    HttpOnly = true,
                                    Secure = true,
                                    SameSite = SameSiteMode.None,
                                    Expires = DateTime.UtcNow.AddMinutes(30),
                                };

                                Response.Cookies.Append("jwtToken", token, cookieOptions);

                                return Ok(response);
                            }
                        }
                        
                        else if (roles.Contains("Student"))
                        {
                            var savedUser = await studentRepository.GetStudentByNameAsync(loginDTO.Username);

                            if (savedUser != null)
                            {
                                var token = tokenRepository.CreateJWTToken(user, roles.ToList());

                                var response = new LoginResponseDTO
                                {
                                    JwtToken = token,
                                    UserID = savedUser.StudentID,
                                    Roles = roles.ToList(),
                                };

                                var cookieOptions = new CookieOptions
                                {
                                    HttpOnly = true,
                                    Secure = true,
                                    SameSite = SameSiteMode.None,
                                    Expires = DateTime.UtcNow.AddMinutes(30),
                                };

                                Response.Cookies.Append("jwtToken", token, cookieOptions);

                                return Ok(response);
                            }
                        }
                    }
                    return BadRequest("Role invalid");
                }

                return BadRequest("Password incorrect");
            }

            return BadRequest("User does not exist");
        }
    }
}
