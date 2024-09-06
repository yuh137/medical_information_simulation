using Medical_Information.API.Models.DTO.Auth;
using Medical_Information.API.Repositories.Interfaces.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;

        public AuthController(UserManager<IdentityUser> userManager, ITokenRepository tokenRepository)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
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

            if (identityResult.Succeeded)
            {
                if (requestDTO.Roles != null && requestDTO.Roles.Any())
                {
                    identityResult = await userManager.AddToRolesAsync(identityUser, requestDTO.Roles);

                    if (identityResult.Succeeded)
                    {
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
                        var token = tokenRepository.CreateJWTToken(user, roles.ToList());

                        var response = new LoginResponseDTO
                        {
                            JwtToken = token,
                        };

                        return Ok(response);
                    }
                }

                return BadRequest("Password incorrect");
            }

            return BadRequest("User does not exist");
        }
    }
}
